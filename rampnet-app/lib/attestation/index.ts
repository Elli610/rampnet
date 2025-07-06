import { AbiCoder } from "ethers";
import { 
  prepareAttestationRequestBase, 
  submitAttestationRequest, 
  retrieveDataAndProofBaseWithRetry, 
  masterIssuer, 
  toUtf8HexString,
  type PrepareAttestationResponse,
  type ProofResponse
} from "./base";
import "dotenv/config";

const { WEB2JSON_VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET, COSTON2_DA_LAYER_URL, WISE_API_KEY } = process.env;

// Configuration constants
const attestationTypeBase = "Web2Json";
const sourceIdBase = "PublicWeb2";
const verifierUrlBase = WEB2JSON_VERIFIER_URL_TESTNET;

interface WisePaymentProofResult {
  transactionHash: string;
  proof: ProofResponse;
  roundId: number;
  decodedData: {
    paymentStatus: string;
    recipientId: bigint;
    recipientAccount: bigint;
    paymentReference: string;
  };
}

interface WiseRequestBody {
  url: string;
  httpMethod: string;
  headers: string;
  queryParams: string;
  body: string;
  postProcessJq: string;
  abiSignature: string;
  [key: string]: unknown; // Signature d'index pour compatibilité avec Record<string, unknown>
}

interface EvmProofData {
  attestationType: string;
  sourceId: string;
  votingRound: number;
  lowestUsedTimestamp: bigint;
  requestBody: WiseRequestBody;
  responseBody: {
    abiEncodedData: string;
  };
}

interface EvmProof {
  merkleProof: string;
  data: EvmProofData;
}

/**
 * Processes a Wise payment attestation from start to finish
 * @param paymentId - The Wise payment ID to attest
 * @returns Promise<WisePaymentProofResult> - Complete proof result with transaction hash
 */
export async function processWisePaymentAttestation(paymentId: number): Promise<WisePaymentProofResult> {
  console.log(`Starting Wise payment attestation for payment ID: ${paymentId}`);

  try {
    // Step 1: Prepare attestation request
    console.log("Step 1: Preparing attestation request...");
    const data = await prepareAttestationRequest(paymentId);
    
    // Step 2: Submit attestation request
    console.log("Step 2: Submitting attestation request...");
    const abiEncodedRequest = data.abiEncodedRequest;
    const roundId = await submitAttestationRequest(abiEncodedRequest);
    
    // Step 3: Retrieve data and proof
    console.log("Step 3: Retrieving data and proof...");
    const proof = await retrieveDataAndProof(abiEncodedRequest, roundId);
    
    // Step 4: Broadcast proof and get transaction hash
    console.log("Step 4: Broadcasting proof...");
    const { transactionHash, decodedData } = await broadcastProof(proof, roundId, paymentId);
    
    console.log(`✅ Wise payment attestation completed successfully!`);
    console.log(`Transaction hash: ${transactionHash}`);
    
    return {
      transactionHash,
      proof,
      roundId,
      decodedData
    };

  } catch (error) {
    console.error(`❌ Error processing Wise payment attestation for payment ID ${paymentId}:`, error);
    throw error;
  }
}

async function prepareAttestationRequest(paymentId: number): Promise<PrepareAttestationResponse> {
  const apiUrl = `https://wise.com/api/v3/payment/details`;
  const postProcessJq = `{paymentStatus: .paymentStatus, recipientId: (.recipient.id | tonumber), recipientAccount: (.recipient.account | split("(")[1] | split(")")[0] | tonumber), paymentReference: ("0x" + .paymentReference) }`;
  const httpMethod = "GET";
  const headers = `{"Authorization": "Bearer ${WISE_API_KEY}"}`;
  const queryParams = `{"paymentId":${paymentId}, "simplifiedResult":0}`;
  const body = ``;
  const abiSignature = `{"components": [{"internalType": "string", "name": "paymentStatus", "type": "string"},{"internalType": "uint256", "name": "recipientId", "type": "uint256"},{"internalType": "uint256", "name": "recipientAccount", "type": "uint256"},{"internalType": "bytes", "name": "paymentReference", "type": "bytes"}],"name": "task","type": "tuple"}`;

  const requestBody: WiseRequestBody = {
    url: apiUrl,
    httpMethod: httpMethod,
    headers: headers,
    queryParams: queryParams,
    body: body,
    postProcessJq: postProcessJq,
    abiSignature: abiSignature,
  };

  console.log("Request body:", requestBody);

  const url = `${verifierUrlBase}Web2Json/prepareRequest`;
  const apiKey = VERIFIER_API_KEY_TESTNET!;

  return await prepareAttestationRequestBase(url, apiKey, attestationTypeBase, sourceIdBase, requestBody);
}

async function retrieveDataAndProof(abiEncodedRequest: string, roundId: number): Promise<ProofResponse> {
  const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
  console.log("Retrieving proof from URL:", url);
  return await retrieveDataAndProofBaseWithRetry(url, abiEncodedRequest, roundId);
}

async function broadcastProof(
  proof: ProofResponse, 
  roundId: number, 
  paymentId: number
): Promise<{ transactionHash: string; decodedData: WisePaymentProofResult['decodedData'] }> {
  console.log("Broadcasting proof...");

  const abiCoder = new AbiCoder();

  const typeString = "tuple(bytes32 attestationType, bytes32 sourceId, uint64 votingRound, uint64 lowestUsedTimestamp, tuple(string url, string httpMethod, string headers, string queryParams, string body, string postProcessJq, string abiSignature) requestBody, tuple(bytes abiEncodedData) responseBody)";

  if (!proof.response_hex) {
    throw new Error("Missing response_hex in proof");
  }

  const decodedResponse = abiCoder.decode([typeString], proof.response_hex);
  console.log("Decoded proof response received");

  const rep = decodedResponse.toArray()[0].toArray();
  const decodedBankTransferData = abiCoder.decode(["(string,uint256,uint256,bytes)"], rep[5].toArray()[0]);
  
  const flatData = decodedBankTransferData.flatMap((item: string | bigint) => item);
  console.log("Decoded Wise payment data:", {
    paymentStatus: flatData[0],
    recipientId: flatData[1],
    recipientAccount: flatData[2],
    paymentReference: flatData[3]
  });

  // Create the API URL with the specific payment ID
  const apiUrl = `https://wise.com/api/v3/payment/details`;
  const postProcessJq = `{paymentStatus: .paymentStatus, recipientId: (.recipient.id | tonumber), recipientAccount: (.recipient.account | split("(")[1] | split(")")[0] | tonumber), paymentReference: ("0x" + .paymentReference) }`;
  const httpMethod = "GET";
  const headers = `{"Authorization": "Bearer ${WISE_API_KEY}"}`;
  const queryParams = `{"paymentId":${paymentId}, "simplifiedResult":0}`;
  const body = ``;
  const abiSignature = `{"components": [{"internalType": "string", "name": "paymentStatus", "type": "string"},{"internalType": "uint256", "name": "recipientId", "type": "uint256"},{"internalType": "uint256", "name": "recipientAccount", "type": "uint256"},{"internalType": "bytes", "name": "paymentReference", "type": "bytes"}],"name": "task","type": "tuple"}`;

  if (!proof.proof || !proof.attestation_type) {
    throw new Error("Missing required proof fields");
  }

  const evmProof: EvmProof = {
    merkleProof: proof.proof,
    data: {
      attestationType: proof.attestation_type,
      sourceId: toUtf8HexString(sourceIdBase),
      votingRound: roundId,
      lowestUsedTimestamp: rep[3] as bigint,
      requestBody: {
        url: apiUrl,
        httpMethod,
        headers,
        queryParams,
        body,
        postProcessJq,
        abiSignature
      },
      responseBody: {
        abiEncodedData: abiCoder.encode(["(string,uint256,uint256,bytes)"], [flatData]),
      }
    }
  };

  console.log("Submitting proof to blockchain...");

  const tx = await masterIssuer.submitProof(evmProof);
  const result = await tx.wait();

  if (!result?.hash) {
    throw new Error("Transaction failed or missing hash");
  }

  console.log(`✅ Proof submitted successfully! Transaction hash: ${result.hash}`);

  return {
    transactionHash: result.hash,
    decodedData: {
      paymentStatus: flatData[0] as string,
      recipientId: flatData[1] as bigint,
      recipientAccount: flatData[2] as bigint,
      paymentReference: flatData[3] as string
    }
  };
}

// Example usage function
async function main(): Promise<void> {
  const paymentId = 1615160706; // Example payment ID
  
  try {
    const result = await processWisePaymentAttestation(paymentId);
    console.log("Final result:", result);
    process.exit(0);
  } catch (error) {
    console.error("Main execution failed:", error);
    process.exit(1);
  }
}

// Export the main function for use in other modules
export { main };

// Run if called directly
if (require.main === module) {
  void main();
}