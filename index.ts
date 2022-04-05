import { Token } from "@uniswap/sdk-core";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

const provider = new ethers.providers.InfuraProvider();

const poolAddress = "0x07a6e955ba4345bae83ac2a6faa771fddd8a2011";

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3Pool.abi,
  provider
);

const token0 = await poolContract.token0();
const token1 = await poolContract.token1();
const fee = await poolContract.fee();

const MATIC = new Token(1, token0, 18, "Matic");
const USDC = new Token(1, token1, 6, "USDC");

const slot = await poolContract.slot0();
const state = {
  liquidity: await poolContract.liquidity(),
  sqrtPriceX96: slot[0],
  tick: slot[1],
  observationIndex: slot[2],
  observationCardinality: slot[3],
  observationCardinalityNext: slot[4],
  feeProtocol: slot[5],
  unlocked: slot[6],
};

const MATIC_USDC_POOL = new Pool(
  MATIC,
  USDC,
  fee,
  state.sqrtPriceX96.toString(),
  state.liquidity.toString(),
  state.tick
);

const price = MATIC_USDC_POOL.token0Price.toSignificant();

console.log("MATIC:", price);
