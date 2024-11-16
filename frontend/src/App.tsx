import { useAccount, useReadContract, useReadContracts } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import { CONTRACT_ADDRESS, BACKEND_URL } from "./config/constants";
import { useMemo } from "react";
import DEPLOYER_ABI from "./config/abi/deployer.json";
import POAP_DISPLAYER_ABI from "./config/abi/poapDisplayer.json";
import { useQuery } from "@tanstack/react-query";
import { Address, Abi } from "viem";
import ModalPoap from "./components/ModalPoap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import VerifySection from "./components/VerifySection";

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
      const poaps = data.message;
      return await Promise.all(
        poaps.map(async (poap: string) => {
          const res = await fetch(`${BACKEND_URL}event/${poap}`);
          return await res.json();
        })
      );
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
    <section className="flex flex-col w-full items-center px-10 justify-center">
      <Toaster />

      <div className="flex max-w-[1024px] w-full justify-between items-center px-4 h-[64px]">
        <h1 className="text-2xl font-bold">POAP zk</h1>
        <ConnectButton />
      </div>
      <Tabs defaultValue="poaps" className="w-full max-w-[1024px]">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="poaps">
            POAPs 🎟️
          </TabsTrigger>
          <TabsTrigger className="w-full" value="verify">
            Verify 🔏
          </TabsTrigger>
        </TabsList>
        <TabsContent value="poaps">
          <>
            {isLoading && <p>Loading POAPs...</p>}
            {error && <p>Error loading POAPs: {error.message}</p>}
            {poaps && (
              <div className="flex flex-wrap gap-4 p-4 justify-center items-center">
                {poaps.map((poap: any, index: number) => (
                  <ModalPoap
                    key={index}
                    title={poap.message.name}
                    description={poap.message.description}
                    imageUrl={poap.message.image_url}
                  >
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:scale-110 cursor-pointer">
                      <img
                        src={`${poap.message.image_url}?size=small`}
                        alt={poap.message.name}
                        className="w-full h-full object-cover"
                        title={poap.message.name}
                      />
                    </div>{" "}
                  </ModalPoap>
                ))}
              </div>
            )}
            {isConnected && <p>Address: {address}</p>}

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
        </TabsContent>
        <TabsContent value="verify">
          <VerifySection />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default App;
