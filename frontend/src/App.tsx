import { ConnectKitButton } from "connectkit";
import { Coffee, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
// import { loremIpsum } from "./lib/lorem";
import { useEffect, useState } from "react";
import { toBase64 } from "./lib/encode";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { client } from "./lib/client";
import { useToast } from "./hooks/use-toast";
import { useAccount, useWriteContract } from "wagmi";
import { chariteaAbi } from "./lib/abi";
import { chariteaAddress } from "./lib/consts";
import { Toaster } from "./components/ui/toaster";
import { parseEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getFunds } from "./lib/query";

export default function App() {
  // const funds = [
  //   {
  //     index: 0,
  //     title: "Flash floods - Sungai Buloh",
  //     description: "Help flash flood victims in Sungai Buloh",
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  // ];
  // const funds = [
  //   {
  //     index: 0,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 1,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 2,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 3,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 4,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 5,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 6,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  //   {
  //     index: 7,
  //     title: "My Fund",
  //     description: loremIpsum,
  //     timestamp: Date.now() / 1000,
  //     owner: "0xE9Faf59a975BEB99678ACc785c5a901De32bE7C8",
  //     imageUri: "/fund-image.jpg",
  //     donations: "10.4",
  //   },
  // ];

  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [encodedImage, setEncodedImage] = useState<string | undefined>(
    undefined
  );
  const [showNewFundDialog, setShowNewFundDialog] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | undefined>();
  const [isVerifySuccess, setIsVerifySuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState("0");
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const fundsQuery = useQuery({ queryKey: ["get-funds"], queryFn: getFunds });

  useEffect(() => {
    if (!image) return;
    (async () => {
      const enImage = await toBase64(image);
      setEncodedImage(enImage);
    })();
  }, [image]);

  const handleSubmit = (open: () => void) => {
    if (!title || !description || !image) return;
    open();
  };

  const handleVerify = async (params: ISuccessResult) => {
    if (!title || !description || !encodedImage)
      throw new Error("unexpected missing fields");
    const res = await client.funds.post({
      worldIdData: { ...params, action: "create-fund" },
      title,
      base64EncodedImage: encodedImage,
      description,
    });
    if (res.error) {
      console.error(res.error.status, res.error.value);
      toast({
        title: "An error occured",
        description: "See the console for more info",
      });
      return;
    }

    setIpfsHash(res.data);
  };

  const handleSuccess = async (params: ISuccessResult) => {
    if (!ipfsHash) {
      console.error("unexpected empty fields");
      toast({
        title: "An error occured",
        description: "See the console for more info",
      });
      return;
    }
    setIsVerifySuccess(true);
    try {
      await writeContractAsync({
        abi: chariteaAbi,
        address: chariteaAddress,
        functionName: "createFund",
        args: [ipfsHash, params.proof],
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "An error occured",
        description: "See the console for more info",
      });
    }
  };

  const handleWithdraw = async (fundIndex: number) => {
    await writeContractAsync({
      abi: chariteaAbi,
      address: chariteaAddress,
      functionName: "withdrawFund",
      args: [BigInt(fundIndex)],
    });
    toast({
      title: "Successfully withdrew fund",
    });
  };

  const handleDonate = async (fundIndex: number) => {
    const value = parseEther(donationAmount);

    await writeContractAsync({
      abi: chariteaAbi,
      address: chariteaAddress,
      functionName: "donateFund",
      args: [BigInt(fundIndex)],
      value,
    });

    toast({
      title: `Successfully donated ${donationAmount} ETH!`,
    });
  };

  return (
    <div className="max-w-[768px] mx-auto p-4 flex flex-col gap-4">
      {/* navbar */}
      <div className="w-full p-4 px-8 rounded-full outline outline-border outline-1 shadow flex items-center justify-between">
        <p className="font-bold flex gap-2">
          <Coffee></Coffee>Charitea
        </p>
        <ConnectKitButton></ConnectKitButton>
      </div>

      {/* new fund */}
      <Dialog
        open={showNewFundDialog}
        onOpenChange={(open) => setShowNewFundDialog(open)}
      >
        <DialogTrigger asChild>
          <Button className="rounded-full">
            <Plus />
            Create new fund
          </Button>
        </DialogTrigger>
        {isVerifySuccess ? (
          <DialogContent>
            <p className="font-bold">
              Sign the transaction in your wallet to continue.
            </p>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new fund</DialogTitle>
              <DialogDescription>
                You will need to authenticate using World ID as proof of
                personhood.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                  placeholder="My Fund"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  placeholder="Write about your fund..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Cover Image
                </Label>
                <Input
                  onChange={(e) =>
                    setImage(e.target.files?.item(0) ?? undefined)
                  }
                  id="image"
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <IDKitWidget
                app_id={import.meta.env.VITE_WORLDID_APP_ID as `app_${string}`}
                action="create-fund"
                handleVerify={handleVerify}
                signal={JSON.stringify({
                  title,
                  description,
                  image: encodedImage,
                })}
                onSuccess={handleSuccess}
              >
                {({ open }) => (
                  <button
                    className="submit-btn"
                    onClick={() => handleSubmit(open)}
                  >
                    Submit
                  </button>
                )}
              </IDKitWidget>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* funds */}
      {fundsQuery.isLoading ? (
        <p className="font-bold mx-auto">Loading funds...</p>
      ) : fundsQuery.isSuccess ? (
        fundsQuery.data.length > 0 ? (
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {fundsQuery.data.map((fund) => (
              <Card
                key={fund.index}
                className="flex-1 min-w-[350px] shadow rounded-xl"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle
                      className="text-green-400"
                      size={20}
                    ></CheckCircle>
                    {fund.title}
                  </CardTitle>
                  <CardDescription>
                    Total donations: {fund.donations} ETH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <img src={fund.imageUri} width="350" height="300"></img>
                    <p className="overflow-y-auto max-h-[200px]">
                      {fund.description}
                    </p>
                  </div>
                </CardContent>{" "}
                <CardFooter className="flex justify-end gap-2">
                  {address &&
                    address.toLowerCase() === fund.owner.toLowerCase() && (
                      <Button
                        variant={"destructive"}
                        onClick={() => handleWithdraw(fund.index)}
                      >
                        Withdraw
                      </Button>
                    )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Donate</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enter donation amount</DialogTitle>
                      </DialogHeader>
                      <Input
                        type="number"
                        min="0.005"
                        step="0.1"
                        placeholder="0.1 ETH"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                      ></Input>
                      <DialogFooter className="flex justify-end">
                        <Button onClick={() => handleDonate(fund.index)}>
                          Donate {donationAmount} ETH
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mx-auto">
            No funds found yet. Be the first one to create one!
          </p>
        )
      ) : (
        <p className="text-red-400 mx-auto">
          An error occured: {fundsQuery.error?.message}
        </p>
      )}
      <Toaster />
    </div>
  );
}
