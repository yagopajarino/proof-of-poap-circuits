import { useAccount, useReadContract, useReadContracts } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import { CONTRACT_ADDRESS, BACKEND_URL } from "./config/constants";
import { useMemo } from "react";
import DEPLOYER_ABI from "./config/abi/deployer.json";
import POAP_DISPLAYER_ABI from "./config/abi/poapDisplayer.json";
import { useQuery } from "@tanstack/react-query";
import { Address, Abi } from "viem";

// Define una interfaz para el tipo de PoapDistributor
interface PoapDistributor {
  address: string;
  name: string;
  description: string;
  token: string;
  verifier: string;
  storedHashes: number[];
}

function App() {
  const { address, isConnected } = useAccount();

  const {
    data: poaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["poaps", address],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}poaps/${address}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.message;
    },
    enabled: isConnected && !!address,
  });

  const {
    data: poapDeployers,
    isLoading: isLoadingDeployer,
    isError: isErrorDeployer,
  } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: DEPLOYER_ABI as Abi,
    functionName: "getDeployedContracts",
  });

  const {
    data: poapDistributorsData,
    isLoading: isLoadingDistributors,
    isError: isErrorDistributors,
  } = useReadContracts({
    contracts:
      (poapDeployers as Address[])
        ?.map((contractAddress) => [
          {
            address: contractAddress,
            abi: POAP_DISPLAYER_ABI as Abi,
            functionName: "name",
          },
          {
            address: contractAddress,
            abi: POAP_DISPLAYER_ABI as Abi,
            functionName: "description",
          },
          {
            address: contractAddress,
            abi: POAP_DISPLAYER_ABI as Abi,
            functionName: "token",
          },
          {
            address: contractAddress,
            abi: POAP_DISPLAYER_ABI as Abi,
            functionName: "verifier",
          },
          {
            address: contractAddress,
            abi: POAP_DISPLAYER_ABI as Abi,
            functionName: "storedHashes",
          },
        ])
        .flat() ?? [],
  });

  const processedData = useMemo(() => {
    if (!poapDeployers || !poapDistributorsData) return [];

    console.log(poapDistributorsData);

    return (poapDeployers as Address[]).map((contractAddress, index) => {
      const baseIndex = index * 5;
      const result = {
        address: contractAddress,
        name: poapDistributorsData[baseIndex]?.result,
        description: poapDistributorsData[baseIndex + 1]?.result,
        token: poapDistributorsData[baseIndex + 2]?.result,
        verifier: poapDistributorsData[baseIndex + 3]?.result,
        storedHashes: poapDistributorsData[baseIndex + 4]?.result ?? [],
      };
      return result;
    });
  }, [poapDeployers, poapDistributorsData]);

  return (
    <>
      <ConnectButton />
      {isConnected && <p>Address: {address}</p>}
      {isLoading && <p>Loading POAPs...</p>}
      {/* {error && <p>Error loading POAPs: {error.message}</p>}
      {poaps && (
        <div>
          <h2>Your POAPs:</h2>
          <pre>{JSON.stringify(poaps, null, 2)}</pre>
        </div>
      )} */}
      {isLoadingDeployer || isLoadingDistributors ? (
        <div>Loading...</div>
      ) : isErrorDeployer || isErrorDistributors ? (
        <div>Error loading data</div>
      ) : (
        <div>
          {processedData.map((distributor) => (
            <div key={distributor.address}>
              <h2>{distributor.name as string}</h2>
              <p>{distributor.description as string}</p>
              <p>Token: {distributor.token as string}</p>
              <p>Verifier: {distributor.verifier as string}</p>
              <p>
                Stored Hashes:{" "}
                {(distributor.storedHashes as number[])?.map((number) => {
                  return number;
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
