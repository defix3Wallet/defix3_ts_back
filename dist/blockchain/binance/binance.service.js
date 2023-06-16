"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceService = void 0;
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@paraswap/sdk");
const abi_json_1 = __importDefault(require("../abi.json"));
const utils_shared_1 = require("../../shared/utils/utils.shared");
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN = process.env.ETHERSCAN;
const WEB_BSC = process.env.WEB_BSC;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(WEB_BSC || ""));
const paraSwap = (0, sdk_1.constructSimpleSDK)({
    chainId: Number(process.env.PARASWAP_BNB),
    axios: axios_1.default,
});
const dataToken = {
    decimals: 18,
    contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};
class BinanceService {
    getOrderBookCoinToCoin(fromCoin, toCoin) {
        throw new Error("Method not implemented.");
    }
    sendLimitOrder(fromCoin, toCoin, srcAmount, destAmount, blockchain, address, privateKey) {
        throw new Error("Method not implemented.");
    }
    async fromMnemonic(mnemonic) {
        const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
        const credential = {
            name: "BNB",
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
        return credential;
    }
    async fromPrivateKey(privateKey) {
        try {
            const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
            const credential = {
                name: "BNB",
                address: wallet.address,
                privateKey: privateKey,
            };
            return credential;
        }
        catch (error) {
            return null;
        }
    }
    async isAddress(address) {
        return await web3.utils.isAddress(address);
    }
    async getBalance(address) {
        try {
            let balance = await web3.eth.getBalance(address);
            let balanceTotal = 0;
            if (balance) {
                let value = Math.pow(10, 18);
                balanceTotal = Number(balance) / value;
                if (!balanceTotal) {
                    balanceTotal = 0;
                }
                return balanceTotal;
            }
            else {
                return balanceTotal;
            }
        }
        catch (error) {
            console.log(error);
            return 0;
        }
    }
    async getBalanceToken(address, srcContract, decimals) {
        try {
            let contract = new web3.eth.Contract(abi_json_1.default, srcContract);
            const balance = await contract.methods.balanceOf(address).call();
            let balanceTotal = 0;
            if (balance) {
                let value = Math.pow(10, decimals);
                balanceTotal = balance / value;
                if (!balanceTotal) {
                    balanceTotal = 0;
                }
                return balanceTotal;
            }
            else {
                return balanceTotal;
            }
        }
        catch (error) {
            return 0;
        }
    }
    async getFeeTransaction(coin, blockchain, typeTxn) {
        try {
            let comisionAdmin = await utils_shared_1.UtilsShared.getComision(coin);
            const response = await axios_1.default.get("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=3SU1MAWAPX8X39UD6U8JBGTQ5C67EVVRSM");
            const wei = response.data.result.SafeGasPrice;
            if (!wei)
                throw new Error(`Error getting gas price`);
            const feeMain = {
                coin,
                blockchain,
                fee: "",
            };
            let gasLimit = 21000;
            if (coin !== "BNB") {
                gasLimit = 55000;
            }
            let comision;
            if (typeTxn === "TRANSFER") {
                comision = comisionAdmin.transfer;
            }
            else if (typeTxn === "WITHDRAW") {
                comision = comisionAdmin.withdraw;
            }
            if (!comision) {
                feeMain.fee = web3.utils.fromWei(String(gasLimit * wei), "gwei");
            }
            else {
                feeMain.fee = String(Number(web3.utils.fromWei(String(gasLimit * wei), "gwei")) * 2);
            }
            return feeMain;
        }
        catch (err) {
            throw new Error(`Failed to get fee transaction, ${err.message}`);
        }
    }
    async sendTransfer(fromAddress, privateKey, toAddress, amount, coin) {
        try {
            const balance = await this.getBalance(fromAddress);
            if (balance < amount) {
                throw new Error(`Error: You do not have enough funds to make the transfer`);
            }
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 21000;
            const nonce = await web3.eth.getTransactionCount(fromAddress);
            const rawTransaction = {
                from: fromAddress,
                to: toAddress,
                value: web3.utils.toHex(web3.utils.toWei(amount.toLocaleString("fullwide", { useGrouping: false }), "ether")),
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(gasLimit),
                nonce: nonce,
            };
            const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
            if (!signedTransaction.rawTransaction)
                throw new Error(`Error: Failed to sign transaction`);
            const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            if (!transactionHash.transactionHash)
                throw new Error(`Error: Failed to send transaction`);
            return transactionHash.transactionHash;
        }
        catch (err) {
            throw new Error(`Failed to send transfer, ${err.message}`);
        }
    }
    async sendTransferToken(fromAddress, privateKey, toAddress, amount, srcToken) {
        try {
            const balance = await this.getBalanceToken(fromAddress, srcToken.contract, srcToken.decimals);
            if (balance < amount) {
                throw new Error(`Error: You do not have enough funds to make the transfer`);
            }
            const provider = new ethers_1.ethers.providers.InfuraProvider(ETHEREUM_NETWORK, INFURA_PROJECT_ID);
            const minABI = abi_json_1.default;
            const wallet = new ethers_1.ethers.Wallet(privateKey);
            const signer = wallet.connect(provider);
            const contract = new ethers_1.ethers.Contract(srcToken.contract, minABI, signer);
            let value = Math.pow(10, srcToken.decimals);
            let srcAmount = amount * value;
            const tx = await contract.transfer(toAddress, srcAmount.toLocaleString("fullwide", { useGrouping: false }));
            if (!tx.hash)
                throw new Error(`Error tx hash.`);
            return tx.hash;
        }
        catch (err) {
            throw new Error(`Failed to send transfer, ${err.message}`);
        }
    }
    async previewSwap(fromCoin, toCoin, amount, blockchain, address) {
        try {
            let fromToken = await utils_shared_1.UtilsShared.getTokenContract(fromCoin, blockchain);
            let toToken = await utils_shared_1.UtilsShared.getTokenContract(toCoin, blockchain);
            if (!fromToken) {
                fromToken = dataToken;
            }
            if (!toToken) {
                toToken = dataToken;
            }
            let value = Math.pow(10, fromToken.decimals);
            const srcAmount = amount * value;
            const priceRoute = await paraSwap.swap.getRate({
                srcToken: fromToken.contract,
                destToken: toToken.contract,
                amount: srcAmount.toLocaleString("fullwide", { useGrouping: false }),
            });
            const response = await axios_1.default.get("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=3SU1MAWAPX8X39UD6U8JBGTQ5C67EVVRSM");
            let wei = response.data.result.SafeGasPrice;
            const comision = await utils_shared_1.UtilsShared.getComision(blockchain);
            let feeTransfer = "0";
            let porcentFee = 0;
            if (comision.swap) {
                porcentFee = comision.swap / 100;
                if (comision.swap && fromCoin === "BNB") {
                    feeTransfer = web3.utils.fromWei(String(21000 * wei), "gwei");
                }
                else {
                    feeTransfer = web3.utils.fromWei(String(55000 * wei), "gwei");
                }
            }
            const feeGas = web3.utils.fromWei(String(Number(priceRoute.gasCost) * wei), "gwei");
            const srcFee = String(Number(feeTransfer) + Number(feeGas));
            let feeDefix = String(Number(srcFee) * porcentFee);
            const swapRate = String(Number(priceRoute.destAmount) / Math.pow(10, toToken.decimals) / (Number(priceRoute.srcAmount) / Math.pow(10, fromToken.decimals)));
            const dataSwap = {
                exchange: priceRoute.bestRoute[0].swaps[0].swapExchanges[0].exchange,
                fromAmount: priceRoute.srcAmount,
                fromDecimals: fromToken.decimals,
                toAmount: priceRoute.destAmount,
                toDecimals: toToken.decimals,
                block: priceRoute.blockNumber,
                swapRate,
                contract: priceRoute.contractAddress,
                fee: srcFee,
                feeDefix: feeDefix,
                feeTotal: String(Number(srcFee) + Number(feeDefix)),
            };
            return { dataSwap, priceRoute };
        }
        catch (err) {
            throw new Error(`Failed to send transfer, ${err.message}`);
        }
    }
    async sendSwap(priceRoute, privateKey, address) {
        try {
            const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
            const txParams = await paraSwap.swap.buildTx({
                srcToken: priceRoute.srcToken,
                destToken: priceRoute.destToken,
                srcAmount: priceRoute.srcAmount,
                destAmount: priceRoute.destAmount,
                priceRoute: priceRoute,
                userAddress: address,
            });
            const txSigned = await signer.signTransaction(txParams);
            if (!txSigned.rawTransaction)
                throw new Error(`Failed to sign swap.`);
            const result = await web3.eth.sendSignedTransaction(txSigned.rawTransaction);
            const transactionHash = result.transactionHash;
            if (!transactionHash)
                throw new Error(`Failed to send swap, transaction Hash.`);
            const srcAmount = String(Number(priceRoute.srcAmount) / Math.pow(10, priceRoute.srcDecimals));
            const destAmount = String(Number(priceRoute.destAmount) / Math.pow(10, priceRoute.destDecimals));
            return {
                transactionHash,
                srcAmount: srcAmount,
                destAmount: destAmount,
                block: priceRoute.blockNumber,
            };
        }
        catch (err) {
            throw new Error(`Failed to send swap, ${err.message}`);
        }
    }
    cancelLimitOrder(address, privateKey) {
        throw new Error("Method not implemented.");
    }
    getAllLimitOrder(address) {
        throw new Error("Method not implemented.");
    }
}
exports.BinanceService = BinanceService;
