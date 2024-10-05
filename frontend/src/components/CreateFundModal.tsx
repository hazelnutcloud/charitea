import { useState } from "react";
import "./CreateFundModal.css";

export function CreateFundModal(params: {
  onSubmit: (params: {
    title: string;
    description: string;
    image: File;
    worldIdProof: string;
  }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [worldIdProof, setWorldIdProof] = useState<string | undefined>(
    undefined,
  );

  const handleSubmit = () => {
    if (!title || !description || !image || !worldIdProof) return;
    params.onSubmit({ title, description, image, worldIdProof });
  };

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
                    value={image?.webkitRelativePath ?? ""}
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
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="close-btn" onClick={params.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
