import { useState } from "react";
import "./CreateFundModal.css";
import { IDKitWidget } from "@worldcoin/idkit"

export function CreateFundModal(params: {
 closeModal: () => void
}) {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);

  const handleSubmit = (open: () => void) => {
    if (!title || !description || !image) return;
    open()
  };

  const handleVerify = (params: { proof: string }) => {
    console.log(params.proof)
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
