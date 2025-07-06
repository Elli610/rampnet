# 🔁 Flare Feedback – RampNet

## General Experience

Overall, we’ve been **very satisfied** with our experience building on Flare.
The documentation is extensive, the code examples are helpful, and the workshops and mentor support throughout the hackathon were excellent. The mentors were responsive, knowledgeable, and instrumental in helping us move quickly through blockers.

---

## ✅ FTSO – Price Feeds

Integrating the **Flare Time Series Oracle (FTSO)** was smooth and straightforward.
The flow is well-documented, easy to test, and works exactly as expected. It was a great developer experience, and we were able to rely on the data feeds to determine accurate on-chain pricing in our ramping logic.

---

## 🧩 FDC – Data Connector

While we see the power and potential of the **Flare Data Connector (FDC)**, the developer experience could be improved in some areas:

* **Steep learning curve**: It took time to fully understand the full flow (from attestation request to broadcast to smart contract for verification).
* **Callback encoding**: The documentation should more explicitly explain that the callback object (response body) used during attestation verification must be formatted as a **tuple**. This is a key detail that cost us a lot of debugging time.
* `abi.signature` unclear: The way to define and configure abi.signature (used in the callback object) is not sufficiently documented. A concrete explanation with parameter examples would help avoid confusion.
* **Limited developer-friendly examples**: The FDC examples, while functional, could benefit from more complete end-to-end flows, especially from the perspective of smart contract verification.
* **Ethers v6 support**: Most examples are written using Hardhat. For projects using **Ethers v6** (as we did), many parts of the stack had to be rewritten from scratch. Updating examples to support ethers v6 would significantly improve accessibility.

---

## Final Thoughts

We’re excited to continue building with Flare, and we look forward to seeing the tooling mature further.  

Thanks again to the entire Flare team and mentors 🙌
