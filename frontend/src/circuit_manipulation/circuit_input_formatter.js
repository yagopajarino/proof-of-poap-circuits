import {sha256Hash} from './cryptography.js'

export default class CircuitInputFormatter {
    obtainAddressAsField() {
        // Preguntarle a la wallet conectada
    }

    obtainAddressAsU8() {
        let address = this.obtainAddressAsField();
        return this._bigNumberToBytes(address, 20);
    }

    _bigNumberToBytes(num, byteLength) {
        const bytes = [];
        for (let i = 0; i < byteLength; i++) {
            bytes.push(num & 0xff);
            num = num >> 8;
        }
        return bytes.reverse();
    }

    obtainPubKeyX(){
        return this._obtainPubKey().slice(0, 32);
    }

    obtainPubKeyY(){
        return this._obtainPubKey().slice(32, 64);
    }

    _obtainPubKey(){
        const pubKey = "0x00"; // Pedirle a la wallet conectada
        let pubKeyArrayU8 = this._hexStringToUint8Array(pubKey)
        return pubKeyArrayU8
    }

    _hexStringToUint8Array(hexString) {
        if (hexString.startsWith("0x")) {
            hexString = hexString.slice(2);
        }
        if (hexString.length % 2 !== 0) {
            hexString = '0' + hexString;
        }
        const byteArray = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < byteArray.length; i++) {
            byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
        }
        return byteArray;
    }

    obtainSignature() {
        let textToSign = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
        let hashedTextToSign = this._hashArrayIntoU8(textToSign);
        let signature = ...;

    }

    _hashArrayIntoU8(textToSign){

        let hash = await sha256Hash(textToSign);
       
    }
}