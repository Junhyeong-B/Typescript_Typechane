import * as CryptoJS from "crypto-js";

// 1. Typescript 기초
const name = "Bae",
  age = 20,
  gender = "male";

const sayHi1 = (name, age, gender) => {
  console.log(`Hello ${name}, you are ${age}, you are a ${gender}`);
};

sayHi1(name, age, gender);
// sayHi(name, age); // Expected 3 arguments, but got 2. => 자바스크립트에서는 발생하지 않는 에러

/*
  만약 gender 매개변수를 선택적으로 사용하려면 아래와 같이 함수를 작성하면 된다.

  const sayHi = (name, age, gender?) => {
    console.log(`Hello ${name}, you are ${age}, you are a ${gender}`);
  };
*/

// 2. Types
const sayHi2 = (name: string, age: number, gender: string): void => {
  console.log(`Hello ${name}, you are ${age}, you are a ${gender}`);
};

sayHi2("Bae", 20, "male");
// sayHi2("Bae", "20", "male"); // Argument of type 'string' is not assignable to parameter of type 'number'.

// 3. Interface
interface Human {
  name: string;
  age: number;
  gender: string;
}

const person = {
  name: "Bae",
  age: 20,
  gender: "male",
};

const sayHi3 = (person: Human): void => {
  const { name, age, gender } = person;
  console.log(`Hello ${name}, you are ${age}, you are a ${gender}`);
};

sayHi3(person);

// 4. Class
// 클래스를 사용하면 .js 파일로 컴파일 할 때 가져갈 수 있다.
// interface는 .js 파일로 컴파일되지 않는다.
// 타입 지정에 public, private을 사용할 수 있는데, private의 경우 클래스 내부에서만 참조가 가능하다.(public은 외부에서 참조 가능)
class Human2 {
  public name: string;
  public age: number;
  public gender: string;
  constructor(name: string, age: number, gender: string) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
}

const lynn = new Human2("Lynn", 22, "female");
sayHi3(lynn);

export {};

// Blockchain
class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.data === "string" &&
    typeof aBlock.timestamp === "number";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "202020202", "", "Hello", 123456);

const blockchain: Block[] = [genesisBlock];
const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = getNewTimeStamp();
  const nextHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    nextTimestamp,
    data
  );

  const newBlock: Block = new Block(
    newIndex,
    nextHash,
    previousBlock.hash,
    data,
    nextTimestamp
  );

  addBlock(newBlock);

  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("Second Block");
createNewBlock("Third Block");
createNewBlock("Forth Block");

console.log(blockchain);
