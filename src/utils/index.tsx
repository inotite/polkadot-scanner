import React from 'react';
import { Abi } from '@polkadot/api-contract';
import { ApiPromise } from '@polkadot/api';
import { keyring } from '@polkadot/ui-keyring';
import { getTypeDef } from '@polkadot/types';
import type { AnyJson } from '@polkadot/types/types';
import type { KeyringItemType, KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { BlockHash } from '@polkadot/types/interfaces/chain/types'
import type { EventRecord } from '@polkadot/types/interfaces';
import type { Text } from '@polkadot/types';

export default function getAddressMeta (address: string, type: KeyringItemType | null = null): KeyringJson$Meta {
  let meta: KeyringJson$Meta | undefined;
  try {
    const pair = keyring.getAddress(address, type);
    meta = pair && pair.meta;
  } catch (error) {
    throw error;
  }
  return meta || {};
}

export const getContractAbi = (api: ApiPromise, address: string | null): (Abi | null) => {
  if (!address) {
    return null;
  }
  let abi: Abi | undefined;
  const meta = getAddressMeta(address, 'contract');

  try {
    const data = meta.contract && JSON.parse(meta.contract.abi) as AnyJson;
    abi = new Abi(data, api.registry.getChainProperties());
  } catch (error) {
    console.error(error);
  }

  return abi || null;
}

const getBlockInfo = async (api: ApiPromise, hash: BlockHash): Promise<EventRecord[]> => {
  try {
    const signedBlock = await api.rpc.chain.getBlock(hash);
    const allRecords = await api.query.system.events.at(signedBlock.block.header.hash);
    return signedBlock.block.extrinsics.map(({ method: { method, section } }, index): EventRecord[] => {
      return allRecords
        // .filter(({ event: { method, section } }) => section !== 'system' &&
        //   (!['balances', 'treasury'].includes(section) || !['Deposit'].includes(method)) &&
        //   (!['parasInclusion', 'inclusion'].includes(section) || !['CandidateBacked', 'CandidateIncluded'].includes(method)));
    }).reduce((prev, cur) => [...prev, ...cur], []);
  } catch (e) {
    console.log(e);
    return [];
  }
}

export interface EventRecordInfo {
  blockNumber: number;
  blockHash: string;
  event: React.ReactNode | null;
  arguments: string;
}

interface Meta {
  docs: Text[];
}

function splitSingle (value: string[], sep: string): string[] {
  return value.reduce((result: string[], value: string): string[] => {
    return value.split(sep).reduce((result: string[], value: string) => result.concat(value), result);
  }, []);
}

function splitParts (value: string): string[] {
  return ['[', ']'].reduce((result: string[], sep) => splitSingle(result, sep), [value]);
}

function formatMeta (event: string, meta?: Meta): React.ReactNode | null {
  if (!meta || !meta.docs.length) {
    return null;
  }

  const strings = meta.docs.map((d) => d.toString().trim());
  const firstEmpty = strings.findIndex((d) => !d.length);
  const combined = (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ').replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return <><div>{event}</div>{parts.map((part, index) => index % 2 ? <em key={index}>[{part}]</em> : <span key={index}>{part}</span>)}&nbsp;</>;
}

export const getBlocksInfo = async (api: ApiPromise, startBlock: number, endBlock: number): Promise<EventRecordInfo[]> => {
  const blockInfo = new Array(endBlock - startBlock + 1).fill(startBlock);
  const events = await Promise.all(blockInfo.map(async (block, idx) => {
    const blockHash = await api.rpc.chain.getBlockHash(block + idx);
    const evs = await getBlockInfo(api, blockHash);
    return evs.map(ev => ({
      blockNumber: block,
      blockHash: blockHash.toString(),
      event: formatMeta(`${ev.event.section}.${ev.event.method}`, ev.event.meta),
      arguments: ev.event.typeDef.map(({ type }) => getTypeDef(type)).map(({ name, type }, idx) => `${type}: ${ev.event.data[idx]}`).join(', ')
    }));
  }));
  return events.reduce((prev, cur) => [...prev, ...cur], []);
}
