import { AbiCoder } from "ethers";
import { prepareAttestationRequestBase, submitAttestationRequest, retrieveDataAndProofBaseWithRetry, masterIssuer, toUtf8HexString } from "./base";
import "dotenv/config";

const { WEB2JSON_VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET, COSTON2_DA_LAYER_URL, WISE_API_KEY } = process.env;

const paymentId = 1615160706;

// Request data
const apiUrl = `https://wise.com/api/v3/payment/details`;
const postProcessJq = `{paymentStatus: .paymentStatus, recipientId: (.recipient.id | tonumber), recipientAccount: (.recipient.account | split("(")[1] | split(")")[0] | tonumber), paymentReference: ("0x" + .paymentReference) }`;
const httpMethod = "GET";
const headers = `{"Authorization": "Bearer ${WISE_API_KEY}"}`;
const queryParams = `{"paymentId":${paymentId}, "simplifiedResult":0}`;
const body = ``;
const abiSignature = `{"components": [{"internalType": "string", "name": "paymentStatus", "type": "string"},{"internalType": "uint256", "name": "recipientId", "type": "uint256"},{"internalType": "uint256", "name": "recipientAccount", "type": "uint256"},{"internalType": "bytes", "name": "paymentReference", "type": "bytes"}],"name": "task","type": "tuple"}`;

// Configuration constants
const attestationTypeBase = "Web2Json";
const sourceIdBase = "PublicWeb2";
const verifierUrlBase = WEB2JSON_VERIFIER_URL_TESTNET;

async function prepareAttestationRequest(apiUrl: string, postProcessJq: string, abiSignature: string): Promise<any> {
    const requestBody = {
        url: apiUrl,
        httpMethod: httpMethod,
        headers: headers,
        queryParams: queryParams,
        body: body,
        postProcessJq: postProcessJq,
        abiSignature: abiSignature,
    };

    console.log("Request body:", requestBody, "\n");

    const url = `${verifierUrlBase}Web2Json/prepareRequest`;
    const apiKey = VERIFIER_API_KEY_TESTNET!;

    return await prepareAttestationRequestBase(url, apiKey, attestationTypeBase, sourceIdBase, requestBody);
}

async function retrieveDataAndProof(abiEncodedRequest: string, roundId: number) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
    console.log("Url:", url, "n");
    return await retrieveDataAndProofBaseWithRetry(url, abiEncodedRequest, roundId);
}

async function broadcastProof(proof: any, roundId: number) {

    console.log("Broadcasting proof...\n");

    const abiCoder = new AbiCoder();

    console.log("proof:", proof, "\n");

    const typeString = "tuple(bytes32 attestationType, bytes32 sourceId, uint64 votingRound, uint64 lowestUsedTimestamp, tuple(string url, string httpMethod, string headers, string queryParams, string body, string postProcessJq, string abiSignature) requestBody, tuple(bytes abiEncodedData) responseBody)";

    const decodedResponse = abiCoder.decode([typeString], proof.response_hex);
    console.log("Decoded proof:", decodedResponse, "\n");

    const rep = decodedResponse.toArray()[0].toArray();
    console.log("api result from proof: ", rep);
    const decodedBankTransferData = abiCoder.decode(["(string,uint256,uint256,bytes)"], rep[5].toArray()[0]);
    console.log("Decoded bank transfer data:", decodedBankTransferData.flatMap(
        (item: string | bigint) => item
    ), "\n");
    const evmProof = {
        merkleProof: proof.proof,
        data: {
            attestationType: proof.attestation_type,
            sourceId: toUtf8HexString(sourceIdBase),
            votingRound: roundId,
            lowestUsedTimestamp: rep[3],
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
                abiEncodedData: abiCoder.encode(["(string,uint256,uint256,bytes)"], [decodedBankTransferData.flatMap(
                    (item: string | bigint) => item
                )]),
            }
        }
    };

    console.log("EVM proof:", evmProof, "\n");

    const tx = await masterIssuer.submitProof(evmProof);

    const result = await tx.wait();

    console.log("proof: ", proof, "\n");
    console.log("roundId: ", roundId, "\n");
    console.log("Transaction result:", result, "\n");
}

async function main() {
    const data = await prepareAttestationRequest(apiUrl, postProcessJq, abiSignature);
    console.log("Data:", data, "\n");

    const abiEncodedRequest = data.abiEncodedRequest;
    const roundId = await submitAttestationRequest(abiEncodedRequest);

    const proof = await retrieveDataAndProof(abiEncodedRequest, roundId);
    console.log("Proof:", proof, "\n");

    await broadcastProof(proof, roundId);
}

void main().then(() => {
    process.exit(0);
});

// broadcastProof({}, 0).then(() => {
//     process.exit(0);
// });