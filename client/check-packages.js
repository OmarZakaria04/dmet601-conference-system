const expectedPackages = [
  "@testing-library/dom",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/user-event",
  "axios",
  "react-dom",
  "react-router-dom",
  "react-scripts",
  "react",
  "web-vitals"
];

function checkPackages(packages) {
  const missing = [];
  packages.forEach(pkg => {
    try {
      require.resolve(pkg);
    } catch (e) {
      missing.push(pkg);
    }
  });

  if (missing.length > 0) {
    console.log("⚠️  Missing npm packages detected in CLIENT:");
    missing.forEach(pkg => console.log(` - ${pkg}`));
    console.log("Please run 'npm install' in the client folder.\n");
  } else {
    console.log("✅ All expected npm packages are installed in CLIENT.");
  }
}

checkPackages(expectedPackages);
