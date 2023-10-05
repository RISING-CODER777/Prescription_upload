import React, { useState } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";

type Props = {
  imageUrl: string;
};

const UploadPreview = ({ imageUrl }: Props) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.push("/"); // Redirect to the home page (index.tsx)
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="preview_wrapper">
          <CheckCircleIcon className="text-green-200 mx-auto w-12 h-12" />
          <p className="text-center">Upload Successful</p>
          <div className="preview_img_box">
            <Image
              alt="uploaded_img"
              src={imageUrl}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPreview;
