import { useState } from "react";
import "./App.css";
import { CreateFundModal } from "./components/CreateFundModal";
import AddIcon from "./assets/add.png";

function App() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);

  const funds = [
    {
      title: "Institution A",
      description: "city1",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution B",
      description: "city2",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution C",
      description: "city1",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution D",
      description: "city3",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution E",
      description: "city3",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution F",
      description: "city2",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
    {
      title: "Institution G",
      description: "city2",
      imageUri: "./assets/cover/masjidzahir.jpg",
    },
  ];

  return (
    <>
      <div className="fund-home-container">
        <div className="search-filter">
          {/* Search Bar for Institution Name */}
          <input
            type="text"
            name="search"
            placeholder="Search fund or owner.."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Add Funds Button */}
          <button
            title="addfunds"
            className="add-btn"
            onClick={() => setIsFundsModalOpen(true)}
          >
            <img src={AddIcon} alt="" id="add-icon" />
            Create Funds
          </button>
        </div>

        {isFundsModalOpen && (
          <CreateFundModal
            closeModal={() => setIsFundsModalOpen(false)}
          ></CreateFundModal>
        )}

        <div className="result">
          {/* List of Institutions */}
          <ul className="fund-list">
            {funds.map((fund) => (
              <li key={fund.title}>
                <div className="fund-card">
                  <section className="fund-img">
                    <img src={fund.imageUri} alt="" />
                  </section>
                  <section className="fund-detail">
                    {fund.title} - {fund.description}
                  </section>
                  <section className="fund-buttons">
                    <button id="donate">Donate</button>
                  </section>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
