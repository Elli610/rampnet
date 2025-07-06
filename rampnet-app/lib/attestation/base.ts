import { Contract, JsonRpcProvider, Wallet, TransactionReceipt, Block } from "ethers";
import { FdcHubAbi } from "./abis/fdcHub";
import { IFdcRequestFeeConfigurationsAbi } from "./abis/IFdcRequestFeeConfigurations";
import { FlareSystemsManagerAbi } from "./abis/FlareSystemsManager";
import { IRelayAbi } from "./abis/IRelay";
import { IFdcVerificationAbi } from "./abis/IFdcVerification";
import { sleep, toUtf8HexString } from "./utils";
import "dotenv/config";
import { MasterIssuerAbi } from "./abis/MasterIssuerAbi";

// Type definitions
interface AttestationRequest {
  attestationType: string;
  sourceId: string;
  requestBody: Record<string, unknown>;
}

interface PrepareAttestationResponse {
  abiEncodedRequest: string;
  [key: string]: unknown;
}

interface ProofRequest {
  votingRoundId: number;
  requestBytes: string;
}

interface ProofResponse {
  response_hex?: string;
  proof?: string;
  attestation_type?: string;
  [key: string]: unknown;
}

// Coston 2 config
const NETWORK_NAME = "coston2";
const provider = new JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");
const wallet = new Wallet(process.env.PRIVATE_KEY || '', provider);
const fdcHub = new Contract("0x48aC463d7975828989331F4De43341627b9c5f1D", FdcHubAbi, wallet);
const fdcRequestFeeConfigurations = new Contract("0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e", IFdcRequestFeeConfigurationsAbi, wallet);
const flareSystemsManager = new Contract("0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52", FlareSystemsManagerAbi, wallet);
const relay = new Contract("0x97702e350CaEda540935d92aAf213307e9069784", IRelayAbi, wallet);
const fdcVerification = new Contract("0x906507E0B64bcD494Db73bd0459d1C667e14B933", IFdcVerificationAbi, wallet);

async function prepareAttestationRequestBase(
  url: string,
  apiKey: string,
  attestationTypeBase: string,
  sourceIdBase: string,
  requestBody: Record<string, unknown>
): Promise<PrepareAttestationResponse> {
  console.log("Url:", url, "\n");
  const attestationType = toUtf8HexString(attestationTypeBase);
  const sourceId = toUtf8HexString(sourceIdBase);

  const request: AttestationRequest = {
    attestationType: attestationType,
    sourceId: sourceId,
    requestBody: requestBody,
  };
  console.log("[prepareAttestationRequestBase] Prepared request:\n", request, "\n");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (response.status != 200) {
    throw new Error(`[prepareAttestationRequestBase] Response status is not OK, status ${response.status} ${response.statusText}\n`);
  }
  console.log("Response status is OK\n");

  return await response.json() as PrepareAttestationResponse;
}

async function calculateRoundId(transaction: TransactionReceipt): Promise<number> {

  console.log("Transaction receipt:", transaction, "\n");
  const blockNumber = transaction.blockNumber;

  const block: Block | null = await provider.getBlock(blockNumber);
  if (!block) throw new Error(`Block with number ${blockNumber} not found`);

  const blockTimestamp = BigInt(block.timestamp);

  const firsVotingRoundStartTs = BigInt(await flareSystemsManager.firstVotingRoundStartTs());
  const votingEpochDurationSeconds = BigInt(await flareSystemsManager.votingEpochDurationSeconds());

  console.log("Block timestamp:", blockTimestamp, "\n");
  console.log("First voting round start ts:", firsVotingRoundStartTs, "\n");
  console.log("Voting epoch duration seconds:", votingEpochDurationSeconds, "\n");

  const roundId = Number((blockTimestamp - firsVotingRoundStartTs) / votingEpochDurationSeconds);
  console.log("Calculated round id:", roundId, "\n");
  console.log("Received round id:", Number(await flareSystemsManager.getCurrentVotingEpochId()), "\n");
  return roundId;
}

async function submitAttestationRequest(abiEncodedRequest: string): Promise<number> {

  const requestFee = await await fdcRequestFeeConfigurations.getRequestFee(abiEncodedRequest);
  console.log("Request fee:", requestFee.toString(), "\n");

  const transaction = await fdcHub.requestAttestation(abiEncodedRequest, {
    value: requestFee,
  });
  
  // wait for tx to be included
  const receipt = await transaction.wait();
console.log("Transaction receipt:", receipt, "\n");
  const roundId = await calculateRoundId(receipt);
  
  console.log(
    `Check round progress at: https://${NETWORK_NAME}-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc\n`
  );
  return roundId;
}

async function postRequestToDALayer(url: string, request: ProofRequest, watchStatus: boolean = false): Promise<ProofResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      // "X-API-KEY": "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (watchStatus && response.status != 200) {
    throw new Error(`[postRequestToDALayer] Response status is not OK, status ${response.status} ${response.statusText}\n`);
  } else if (watchStatus) {
    console.log("[postRequestToDALayer] Response status is OK\n");
  }
  return await response.json() as ProofResponse;
}

async function retrieveDataAndProofBase(url: string, abiEncodedRequest: string, roundId: number): Promise<ProofResponse> {
  console.log("Waiting for the round to finalize...");
  // We check every 10 seconds if the round is finalized
  const protocolId = await fdcVerification.fdcProtocolId();
  while (!(await relay.isFinalized(protocolId, roundId))) {
    await sleep(30000);
  }
  console.log("Round finalized!\n");

  const request: ProofRequest = {
    votingRoundId: roundId,
    requestBytes: abiEncodedRequest,
  };
  console.log("[retrieveDataAndProofBase] Prepared request:\n", request, "\n");

  await sleep(10000);
  let proof: ProofResponse = await postRequestToDALayer(url, request, true);
  console.log("Response from DA Layer:", proof, "\n");
  console.log("Waiting for the DA Layer to generate the proof...");
  while (proof.response_hex == undefined) {
    await sleep(10000);
    proof = await postRequestToDALayer(url, request, false);
  }
  console.log("Proof generated!\n");

  console.log("Proof:", proof, "\n");
  return proof;
}

async function retrieveDataAndProofBaseWithRetry(
  url: string,
  abiEncodedRequest: string,
  roundId: number,
  attempts: number = 10
): Promise<ProofResponse> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
    } catch (e: unknown) {
      console.log(e, "\n", "Remaining attempts:", attempts - i, "\n");
      await sleep(20000);
    }
  }
  throw new Error(`Failed to retrieve data and proofs after ${attempts} attempts`);
}

export {
  toUtf8HexString,
  sleep,
  prepareAttestationRequestBase,
  submitAttestationRequest,
  retrieveDataAndProofBase,
  retrieveDataAndProofBaseWithRetry,
  calculateRoundId,
  postRequestToDALayer,
};

export type {
  AttestationRequest,
  PrepareAttestationResponse,
  ProofRequest,
  ProofResponse
};