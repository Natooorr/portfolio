# Zachris Stenhammar — Portfolio

A clean, responsive, fast-loading portfolio built with semantic HTML5, CSS3, and modern JavaScript. Optimized for **GitHub Pages** hosting and showcasing on **LinkedIn**.

---

## 🚀 How to Deploy to GitHub Pages Under `https://natooorr.github.io/portfolio/`

### 1. Initialize Git & Commit
Open your terminal and run:
```bash
cd /Users/aidev/portfolio
git init
git add .
git commit -m "feat: initial portfolio for Zachris Stenhammar"
```

### 2. Create Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set the repository name to: **`portfolio`** (or `natooorr.github.io` if you want it as your root domain).
3. Set visibility to **Public**.
4. Leave "Add a README" unchecked.
5. Click **Create repository**.

### 3. Push to GitHub
Run the following commands:
```bash
git remote add origin https://github.com/Natooorr/portfolio.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. On GitHub, navigate to **Settings** $\rightarrow$ **Pages** (in the left sidebar under *Code and automation*).
2. Under **Build and deployment** $\rightarrow$ **Source**, choose **Deploy from a branch**.
3. Under **Branch**, select **`main`** and **`/(root)`**, then click **Save**.
4. Your site will be published at:
   👉 **`https://natooorr.github.io/portfolio/`**

---

## 💼 Adding to Your LinkedIn Profile

Once deployed:

1. **Top Profile Link (Header button):**
   * Edit your LinkedIn intro $\rightarrow$ Scroll down to **Custom button / Website link** $\rightarrow$ URL: `https://natooorr.github.io/portfolio/`, Button text: *"View Portfolio"*.
2. **Featured Section (Cards with previews):**
   * Go to your LinkedIn profile $\rightarrow$ **Add profile section** $\rightarrow$ **Recommended** $\rightarrow$ **Add featured** $\rightarrow$ Click `+` $\rightarrow$ **Add a link** $\rightarrow$ Enter `https://natooorr.github.io/portfolio/`.
3. **Contact Info:**
   * In your LinkedIn header $\rightarrow$ **Contact info** $\rightarrow$ Edit $\rightarrow$ Add website $\rightarrow$ Set type to **Portfolio**.

---

## 🛠 Local Preview
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000).
