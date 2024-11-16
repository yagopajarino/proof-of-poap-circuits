import { compile, createFileManager } from '@noir-lang/noir_wasm';
import fs

export default class CircuitBuilder {

    function stringToStream(text: string): ReadableStream<Uint8Array> {
        const encoder = new TextEncoder();
        const uint8array = encoder.encode(text);
        return new ReadableStream({
            start(controller) {
                controller.enqueue(uint8array);
                controller.close();
            }
        });
    }

    function read_circuit_from_file(){
        let file_circuit_path = "../../loquesea";
        const circuit_src = = fs.readFileSync(file_circuit_path, 'utf-8');
    }

    function read_nargo_toml_from_file(){
        let file_nargo_toml_path = "../../loquesea";
        const nargo_toml_src = = fs.readFileSync(file_nargo_toml_path, 'utf-8');
    }

    async function compileCircuit() {
        const fm = createFileManager('/');
        await fm.writeFile('./src/main.nr', this.stringToStream(this.read_circuit_from_file()));
        await fm.writeFile('./Nargo.toml', this.stringToStream(this.read_nargo_toml_from_file()));
        try {
            const result = await compile(fm);
            return result.program;
        } catch(e){
            throw new Error("Compilation failed: " + e)
        }
    }

    async function generateProof(inputs){
        let currentCompiledCircuit = this.compileCircuit()
        const noir = new Noir(currentCompiledCircuit);
        console.log("Initializing Noir")
        await noir.init();
        console.log("Noir Initialized")
        const { witness } = await noir.execute(inputs);
        console.log("Executed circuit")
        if (!witness) return;
        const barretenbergBackend = new BarretenbergBackend(currentCompiledCircuit, { threads: navigator.hardwareConcurrency });
        console.log("Barretenberg initialized")
        const proofData = await barretenbergBackend.generateProof(witness)
        console.log("Proof generated")
        if (!proofData) return;
        return proofData

    };

}