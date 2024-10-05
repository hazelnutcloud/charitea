import { useEffect, useState } from "react";
import "./CreateFundModal.css";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit"
import { client } from "../lib/client";
import { toBase64 } from "../lib/encode";

export function CreateFundModal(params: {
 closeModal: () => void
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [encodedImage, setEncodedImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!image) return;
    (async () => {
      const enImage = await toBase64(image);
      setEncodedImage(enImage);
    })()
  }, [image])

  const handleSubmit = (open: () => void) => {
     if (!title || !description || !image) return;
    open();
  };

  const handleVerify = async (params: ISuccessResult) => {
    if (!title || !description || !encodedImage) throw new Error("unexpected missing fields");
    const res = await client.funds.post({ worldIdData: {...params, action: "create-fund"}, title, base64EncodedImage: encodedImage, description })
    console.log('res', res)
  }

  return (
    <div className="popup-modal">
      <div className="popup-content">
        <h3>Create Funds</h3>

        <div className="forms-menu">
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="fund">Title</label>
                </td>
                <td>
                  <input
                    id="fund"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="description">Description</label>
                </td>
                <td>
                  <input
                    id="description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="image">Image</label>
                </td>
                <td>
                  <input
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg"
                    placeholder="Image"
                    // value={image?.webkitRelativePath ?? ""}
                    onChange={(e) =>
                      setImage(e.target.files?.item(0) ?? undefined)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="popup-actions">
        <IDKitWidget
          app_id="app_staging_ac0a88ccb1edbf495b092c2408473e4d"
          action="create-fund"
          handleVerify={handleVerify}
          signal={JSON.stringify({title, description, image: encodedImage})}
          onSuccess={() => params.closeModal()}
        >
          {({ open }) => <button className="submit-btn" onClick={() => handleSubmit(open)}>
            Submit
          </button>}
          </IDKitWidget >
          <button className="close-btn" onClick={params.closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
