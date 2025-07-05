import { AbiCoder } from "ethers";
import { prepareAttestationRequestBase, submitAttestationRequest, retrieveDataAndProofBaseWithRetry, masterIssuer, toUtf8HexString } from "./base";
import "dotenv/config";

const { WEB2JSON_VERIFIER_URL_TESTNET, VERIFIER_API_KEY_TESTNET, COSTON2_DA_LAYER_URL, WISE_API_KEY } = process.env;

const paymentId = 1614759566;

// Request data
const apiUrl = `https://wise.com/api/v3/payment/details`;
const postProcessJq = `{paymentStatus: .paymentStatus, recipientId: (.recipient.id | tonumber), recipientAccount: (.recipient.account | split("(")[1] | split(")")[0] | tonumber), paymentReference: .paymentReference }`;
const httpMethod = "GET";
const headers = `{"Authorization": "Bearer ${WISE_API_KEY}"}`;
const queryParams = `{"paymentId":${paymentId}, "simplifiedResult":0}`;
const body = ``;
const abiSignature = `{"components": [{"internalType": "string", "name": "paymentStatus", "type": "string"},{"internalType": "uint256", "name": "recipientId", "type": "uint256"},{"internalType": "uint256", "name": "recipientAccount", "type": "uint256"},{"internalType": "string", "name": "paymentReference", "type": "string"}],"name": "task","type": "tuple"}`;
// const abiSignature = `{"components": [{"internalType": "string", "name": "paymentStatus", "type": "string"},{"internalType": "uint256", "name": "recipientId", "type": "uint256"}],"name": "task","type": "tuple"}`;
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
    /////
    // proof.response_hex = "0x0000000000000000000000000000000000000000000000000000000000000020576562324a736f6e0000000000000000000000000000000000000000000000005075626c6963576562320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fd194000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000002768747470733a2f2f776973652e636f6d2f6170692f76332f7061796d656e742f64657461696c73000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003474554000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000407b22417574686f72697a6174696f6e223a20224265617265722037386164646237612d373938382d346261622d626365322d323633333464363833386435227d000000000000000000000000000000000000000000000000000000000000002e7b227061796d656e744964223a313631343735393536362c202273696d706c6966696564526573756c74223a307d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b7b7061796d656e745374617475733a202e7061796d656e745374617475732c20726563697069656e7449643a202e726563697069656e742e69647d000000000000000000000000000000000000000000000000000000000000000000000000bc7b22636f6d706f6e656e7473223a205b7b22696e7465726e616c54797065223a2022737472696e67222c20226e616d65223a20227061796d656e74537461747573222c202274797065223a2022737472696e67227d2c7b22696e7465726e616c54797065223a202275696e74323536222c20226e616d65223a2022726563697069656e744964222c202274797065223a202275696e74323536227d5d2c226e616d65223a20227461736b222c2274797065223a20227475706c65227d00000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000003fcc77ed000000000000000000000000000000000000000000000000000000000000000b7472616e73666572726564000000000000000000000000000000000000000000";
    /////
    console.log("Broadcasting proof...\n");

    const abiCoder = new AbiCoder();

    const responseType = [{
        components: [
            {
                internalType: 'bytes32',
                name: 'attestationType',
                type: 'bytes32'
            },
            {
                internalType: 'bytes32',
                name: 'sourceId',
                type: 'bytes32'
            },
            {
                internalType: 'uint64',
                name: 'votingRound',
                type: 'uint64'
            },
            {
                internalType: 'uint64',
                name: 'lowestUsedTimestamp',
                type: 'uint64'
            },
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'url',
                        type: 'string'
                    },
                    {
                        internalType: 'string',
                        name: 'method',
                        type: 'string'
                    },
                    {
                        internalType: 'string',
                        name: 'headers',
                        type: 'string'
                    },
                    {
                        internalType: 'string',
                        name: 'body',
                        type: 'string'
                    }
                ],
                internalType: 'struct IWeb2Json.RequestBody',
                name: 'requestBody',
                type: 'tuple'
            },
            {
                components: [
                     {
                        internalType: 'bytes',
                        name: 'recipientId',
                        type: 'bytes'
                    },
                    // {
                    //     internalType: 'string',
                    //     name: 'recipientId',
                    //     type: 'string'
                    // },
                    // {
                    //     internalType: 'uint256',
                    //     name: 'paymentStatus',
                    //     type: 'uint256'
                    // },
                    // {
                    //     internalType: 'uint256',
                    //     name: 'casselescouilles',
                    //     type: 'uint256'
                    // },
                    // {
                    //     internalType: 'string',
                    //     name: 'casselescouilles2',
                    //     type: 'string'
                    // },

                    // ["(string,uint256,uint256,string)"]
                ],
                internalType: 'struct IWeb2Json.ResponseBody',
                name: 'responseBody',
                type: 'tuple'
            }
        ],
        internalType: 'struct IWeb2Json.Response',
        name: 'data',
        type: 'tuple'
    }];

    console.log("proof:", proof, "\n");

    const decodedResponse = abiCoder.decode(responseType as any, proof.response_hex);
    console.log("Decoded proof:", decodedResponse, "\n");

    const rep = decodedResponse.toArray()[0].toArray();
    console.log("api result from proof: ", rep);
    const decodedBankTransferData = abiCoder.decode(["(string,uint256,uint256,string)"], rep[5].toArray()[0]);
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
                httpMethod,//: rep[4].toArray()[1],
                headers,//: rep[4].toArray()[2],
                queryParams,
                body,
                postProcessJq,
                abiSignature
            },
            responseBody: {
                abiEncodedData: abiCoder.encode(["string","uint256","uint256","string"], decodedBankTransferData.flatMap(
                    (item: string | bigint) => item
                )),
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