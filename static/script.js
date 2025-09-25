document.getElementById('carForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);
    this.reset(); // Clear form
  } catch (err) {
    alert('Failed to save car details.');
  }
});
