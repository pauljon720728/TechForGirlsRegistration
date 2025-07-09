let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;
const counter = document.getElementById('clickCounter');
const whatsappBtn = document.getElementById('whatsappBtn');
const form = document.getElementById('registrationForm');
const finalMsg = document.getElementById('finalMessage');
const preview = document.getElementById('preview');

// Check if form was submitted already
if (localStorage.getItem('formSubmitted') === 'true') {
  showSuccessMessage();
}

updateClickCounter();

// WhatsApp Share Logic
whatsappBtn.addEventListener('click', () => {
  if (clickCount < 5) {
    const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");
    window.open(`https://wa.me/?text=${message}`, '_blank');
    clickCount++;
    localStorage.setItem('clickCount', clickCount);
    updateClickCounter();
  }

  if (clickCount === 5) {
    counter.innerText = "Sharing complete. Please continue.";
  }
});

// File preview
form.fileUpload.onchange = (e) => {
  const file = e.target.files[0];
  preview.innerHTML = '';
  if (!file) return;

  if (file.type.includes('image')) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'application/pdf') {
    const embed = document.createElement('embed');
    embed.src = URL.createObjectURL(file);
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '400px';
    preview.appendChild(embed);
  }
};

// Submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (clickCount < 5) {
    alert("Please complete sharing on WhatsApp (5/5) first.");
    return;
  }

  const file = form.fileUpload.files[0];
  if (!file) {
    alert("Please upload a screenshot.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Data = reader.result;

    const payload = {
      name: form.name.value,
      number: form.number.value,
      email: form.email.value.toLowerCase(),
      college: form.college.value,
      "file.name": file.name,
      "file.type": file.type,
      file: base64Data
    };

    const response = await fetch("https://script.google.com/macros/s/AKfycbwjNHLSa4ZlN4GpIKNLp3gDqUaBG86mxX5rJ7D9M-iEUNa2YGSksShRb8qH3KEfinc-/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(payload).toString()
    });

    const text = await response.text();

    if (text === "Duplicate") {
      alert("This email has already submitted the form.");
      return;
    }

    if (response.ok && text === "Success") {
      localStorage.setItem('formSubmitted', 'true');
      showSuccessMessage();
    } else {
      alert("Submission failed. Try again.");
    }
  };

  reader.readAsDataURL(file);
});


function updateClickCounter() {
  counter.innerText = clickCount < 5
    ? `Click count: ${clickCount}/5`
    : "Sharing complete. Please continue.";
}


function showSuccessMessage() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <h1>🚀 Tech For Girls Registration</h1>
    <p style="text-align: center; color: green; font-size: 1.2em;">
      🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!
    </p>
  `;
}
