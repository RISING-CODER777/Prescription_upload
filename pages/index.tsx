import React, { useState, useCallback } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PhotographIcon } from "@heroicons/react/solid";
import { useDropzone } from "react-dropzone";
import initFirebase from "@/lib/firebaseInit";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import UploadProgress from "@/components/uploadProgress";
import UploadPreview from "@/components/uploadPreview";

initFirebase();

const storage = getStorage();
const storageRef = ref(storage, new Date().toISOString());

type Image = {
  imageFile: Blob;
};

const Home: NextPage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    uploadImage({ imageFile: file });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = async ({ imageFile }: Image) => {
    try {
      setLoading(true);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            setLoading(false);
            setSuccess(true);
          });
        }
      );
    } catch (e: any) {
      console.log(e.message);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProgress(0);
    setImageUrl("");
    setLoading(false);
    setSuccess(false);
  };

  return (
    <>
      <Head>
        <title>Prescription</title>
      </Head>
      <div className="main_container">
        {!success && (
          <div
            className={` ${loading ? "hidden" : ""} flex justify-center mt-10`}
          >
            <div className="dropzone">
              <p className="font-bold">Upload Your Prescription</p>
              <p>File should be jpeg, png...</p>
              <div {...getRootProps()} className="drag_drop_wrapper">
                <input hidden {...getInputProps()} />
                <PhotographIcon className="w-16 h-16 text-blue-200" />
                {isDragActive ? (
                  <p>Drop the photo here...</p>
                ) : (
                  <p>Drag & Drop your image here</p>
                )}
              </div>
              <p>Or</p>
              <div className="flex w-full justify-center">
                <button onClick={open} className="dropzone_button">
                  Choose a file
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <UploadProgress progress={progress} />}

        {success && (
          <>
            <UploadPreview imageUrl={imageUrl} />
            <button
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Back
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
