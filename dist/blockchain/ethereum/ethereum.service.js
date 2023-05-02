"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumService = void 0;
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@paraswap/sdk");
const abi_json_1 = __importDefault(require("../abi.json"));
const utils_shared_1 = require("../../shared/utils/utils.shared");
const limit_order_protocol_utils_1 = require("@1inch/limit-order-protocol-utils");
const ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ETHERSCAN = process.env.ETHERSCAN;
const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`https://${ETHEREUM_NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`));
const chainId = 1; // suggested, or use your own number
const connector = new limit_order_protocol_utils_1.Web3ProviderConnector(web3);
const contractAddress = limit_order_protocol_utils_1.limirOrderProtocolAdresses[chainId];
const seriesContractAddress = limit_order_protocol_utils_1.seriesNonceManagerContractAddresses[chainId];
const limitOrderBuilder = new limit_order_protocol_utils_1.LimitOrderBuilder(seriesContractAddress, chainId, connector);
const limitOrderProtocolFacade = new limit_order_protocol_utils_1.LimitOrderProtocolFacade(contractAddress, chainId, connector);
const seriesNonceManagerFacade = new limit_order_protocol_utils_1.SeriesNonceManagerFacade(seriesContractAddress, chainId, connector);
const paraSwap = (0, sdk_1.constructSimpleSDK)({
    chainId: Number(process.env.PARASWAP_ETH),
    axios: axios_1.default,
});
const dataToken = {
    decimals: 18,
    contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
};
class EthereumService {
    constructor() {
        this.sendLimitOrder = async (fromCoin, toCoin, srcAmount, destAmount, blockchain, address, privateKey) => {
            try {
                let fromToken = await utils_shared_1.UtilsShared.getTokenContract(fromCoin, blockchain);
                let toToken = await utils_shared_1.UtilsShared.getTokenContract(toCoin, blockchain);
                if (!fromToken) {
                    fromToken = dataToken;
                }
                if (!toToken) {
                    toToken = dataToken;
                }
                let fromValue = Math.pow(10, fromToken.decimals);
                const srcAmountLimit = Math.round(srcAmount * fromValue);
                let toValue = Math.pow(10, toToken.decimals);
                const destAmountLimit = Math.round(destAmount * toValue);
                const limitOrder = limitOrderBuilder.buildLimitOrder({
                    makerAssetAddress: fromToken.contract,
                    takerAssetAddress: toToken.contract,
                    makerAddress: address,
                    makingAmount: String(srcAmountLimit),
                    takingAmount: String(destAmountLimit),
                    // predicate,
                    // permit = '0x',
                    // receiver = ZERO_ADDRESS,
                    // allowedSender = ZERO_ADDRESS,
                    // getMakingAmount = ZERO_ADDRESS,
                    // getTakingAmount = ZERO_ADDRESS,
                    // preInteraction  = '0x',
                    // postInteraction = '0x',
                });
                const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
                const privateKeyProviderConnector = new limit_order_protocol_utils_1.PrivateKeyProviderConnector(privateKey, web3);
                const limitOrderSignature = await privateKeyProviderConnector.signTypedData(address, limitOrderTypedData);
                console.log("Signature");
                console.log(limitOrderSignature);
                // console.log(limitOrderSignature);
                const callData = limitOrderProtocolFacade.fillLimitOrder({
                    order: limitOrder,
                    signature: limitOrderSignature,
                    makingAmount: String(srcAmountLimit),
                    takingAmount: String(destAmountLimit),
                    thresholdAmount: "50",
                });
                console.log("BRRRRRRr");
                console.log(callData);
                const provider = ethers_1.ethers.getDefaultProvider(1);
                const signer = new ethers_1.ethers.Wallet(privateKey, provider);
                const resp = await signer.sendTransaction({
                    from: address,
                    gasLimit: 210000,
                    gasPrice: 40000,
                    to: contractAddress,
                    data: callData,
                });
                console.log("RES", resp);
                return resp;
            }
            catch (error) {
                throw new Error(`Failed to send order limit, ${error.message}`);
            }
        };
    }
    async fromMnemonic(mnemonic) {
        const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
        const credential = {
            name: "ETH",
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
        return credential;
    }
    async fromPrivateKey(privateKey) {
        try {
            const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
            const credential = {
                name: "ETH",
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
            const response = await axios_1.default.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6");
            const wei = response.data.result.SafeGasPrice;
            if (!wei)
                throw new Error(`Error getting gas price`);
            const feeMain = {
                coin,
                blockchain,
                fee: "",
            };
            let gasLimit = 21000;
            if (coin !== "ETH") {
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
                value: web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether")),
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
            // const response = await axios.get(
            //   "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6"
            // );
            // let wei = response.data.result.SafeGasPrice;
            // let fee = Number(web3.utils.fromWei(String(21000 * wei), "gwei"));
            // const resp_comision = await GET_COMISION(coin);
            // const vault_address = await ADDRESS_VAULT(coin);
            // const comision = resp_comision.transfer / 100;
            // let amount_vault = Number((fee * comision).toFixed(18));
            // console.log(amount_vault, vault_address);
            // if (amount_vault !== 0 && vault_address) {
            //   await payCommissionETH(
            //     fromAddress,
            //     privateKey,
            //     vault_address,
            //     amount_vault
            //   );
            // }
            // if (!transactionHash.transactionHash) return false;
            // return transactionHash.transactionHash as string;
        }
        catch (err) {
            console.log(err);
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
            const tx = await contract.transfer(toAddress, String(srcAmount));
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
                amount: String(srcAmount),
            });
            const response = await axios_1.default.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=ZAXW568KING2VVBGAMBU7399KH7NBB8QX6");
            let wei = response.data.result.SafeGasPrice;
            const comision = await utils_shared_1.UtilsShared.getComision(blockchain);
            let feeTransfer = "0";
            let porcentFee = 0;
            if (comision.swap) {
                porcentFee = comision.swap / 100;
                if (comision.swap && fromCoin === "ETH") {
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
            throw new Error(`Failed to get preview, ${err.message}`);
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
}
exports.EthereumService = EthereumService;
