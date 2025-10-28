// ====== Static itineraries ======
const itineraries = {
  London: [
    { day: 1, theme: "Historic & Iconic", places: ["Buckingham Palace", "Westminster Abbey", "Big Ben", "London Eye"], transport: "Metro / Walk", duration: "8h" },
    { day: 2, theme: "Culture & Classics", places: ["British Museum", "Covent Garden", "Trafalgar Square", "National Gallery"], transport: "Bus / Walk", duration: "7h" },
    { day: 3, theme: "Modern & Scenic", places: ["Tower of London", "Tower Bridge", "Borough Market", "The Shard"], transport: "Metro / Walk", duration: "8h" }
  ],
  Paris: [
    { day: 1, theme: "Iconic Paris", places: ["Eiffel Tower", "Louvre Museum", "Champs-Élysées"], transport: "Metro / Walk", duration: "8h" },
    { day: 2, theme: "Charming & Historic", places: ["Notre Dame", "Latin Quarter", "Montmartre"], transport: "Bus / Walk", duration: "7h" }
  ]
};

const fallbackAttractions = ["Central Park", "Main Museum", "Historic Center", "Popular Market", "Scenic Viewpoint", "Local Neighborhood"];
const popular = ["London", "Paris", "Tokyo", "New York", "Rome", "Dubai"];

// ====== Elements ======
const destInput = document.getElementById("destination-input");
const generateBtn = document.getElementById("generate-btn");
const itineraryArea = document.getElementById("itinerary-area");
const printBtn = document.getElementById("print-btn");
const resetBtn = document.getElementById("reset-btn");
const anotherBtn = document.getElementById("another-btn");
const suggestionsEl = document.getElementById("suggestions");
const feedbackPanel = document.getElementById("feedback-panel");
const starRow = document.getElementById("star-row");
const feedbackText = document.getElementById("feedback-text");
const submitFeedbackBtn = document.getElementById("submit-feedback");
const feedbackMsg = document.getElementById("feedback-msg");

// ====== Functions ======
function titleCase(str) {
  return str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function renderSuggestions() {
  suggestionsEl.innerHTML = "";
  popular.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = city;
    btn.onclick = () => {
      destInput.value = city;
      generateItinerary();
    };
    suggestionsEl.appendChild(btn);
  });
}

function generateItinerary() {
  const destination = titleCase(destInput.value);
  if (!destination) return alert("Please enter a destination!");

  const data = itineraries[destination] || createDynamicItinerary(destination);
  renderItinerary(destination, data);
  feedbackPanel.style.display = "block";
}

function createDynamicItinerary(destination) {
  const days = 3;
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    const places = fallbackAttractions.slice((i - 1) * 2, i * 2);
    itinerary.push({
      day: i,
      theme: `${destination} Highlights`,
      places,
      transport: i % 2 === 0 ? "Bus / Walk" : "Metro / Walk",
      duration: "6–8h"
    });
  }
  return itinerary;
}

function renderItinerary(destination, itinerary) {
  itineraryArea.innerHTML = "";
  const header = document.createElement("div");
  header.className = "day-card";
  header.innerHTML = `<div class="day-title">Itinerary for <strong>${destination}</strong></div>`;
  itineraryArea.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "itinerary-grid";

  itinerary.forEach(day => {
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `
      <div class="day-title">Day ${day.day} — ${day.theme}</div>
      <ol class="places">${day.places.map(p => `<li>${p}</li>`).join("")}</ol>
      <div class="meta">Transport: ${day.transport} • Duration: ${day.duration}</div>`;
    grid.appendChild(card);
  });

  itineraryArea.appendChild(grid);
}

printBtn.onclick = () => window.print();
resetBtn.onclick = () => {
  destInput.value = "";
  itineraryArea.innerHTML = "";
  feedbackPanel.style.display = "none";
};
anotherBtn.onclick = () => destInput.focus();

// ====== Feedback ======
let selectedRating = 0;
starRow.onclick = e => {
  if (!e.target.classList.contains("star")) return;
  selectedRating = +e.target.dataset.value;
  [...starRow.children].forEach(star =>
    star.classList.toggle("selected", +star.dataset.value <= selectedRating)
  );
};

submitFeedbackBtn.onclick = () => {
  if (!selectedRating) return (feedbackMsg.textContent = "Please select a star rating.");
  const comment = feedbackText.value.trim();
  const data = { rating: selectedRating, comment, date: new Date().toLocaleString() };
  localStorage.setItem("travelFeedback", JSON.stringify(data));
  feedbackMsg.textContent = "Feedback saved locally. Thank you!";
  feedbackText.value = "";
  selectedRating = 0;
  [...starRow.children].forEach(star => star.classList.remove("selected"));
};

// ====== Initialize ======
renderSuggestions();
feedbackPanel.style.display = "none";
