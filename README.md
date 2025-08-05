## 🧠 Prediction and Optimization of 3D Printing Parameters Using Machine Learning (Python)

This project applies **machine learning** techniques using **Python** to predict and optimize key 3D printing parameters — **nozzle diameter**, **nozzle temperature**, and **print speed** — to minimize **stress levels** in **additive-manufactured Polylactic Acid (PLA)** biomaterials.

### 🔍 Objective  
The goal is to build predictive models that analyze how printing parameters affect internal stress in 3D-printed PLA parts and identify the optimal settings to reduce stress and improve mechanical performance. This is especially important in biomedical applications where strength and precision are critical.

### 🧰 Technologies Used  
- **Programming Language:** Python  
- **Libraries:** pandas, numpy, matplotlib, seaborn, scikit-learn, joblib  
- **Machine Learning Models:** Decision Tree, Random Forest, Linear Regression  
- **Optimization:** GridSearchCV for hyperparameter tuning

### 📊 Workflow  
1. **Data Collection & Preprocessing:** Dataset includes nozzle size, temperature, speed, and measured stress.  
2. **EDA (Exploratory Data Analysis):** Trends and correlations visualized using Python plots.  
3. **Model Training:** Models trained using scikit-learn to predict stress levels.  
4. **Evaluation:** R² score and RMSE used to evaluate performance.  
5. **Optimization:** Used GridSearchCV to suggest best parameter combinations to reduce stress.

### ✅ Results  
- **Random Forest** showed the highest accuracy in predicting stress levels.  
- The project successfully identified optimal printing settings to improve part quality and reduce internal stress.

### 📁 Project Structure  
- `/data`: Dataset files  
- `/notebooks`: Jupyter notebooks for analysis and modeling  
- `/models`: Trained ML models (joblib format)  
- `/plots`: Visual results (graphs and charts)  
- `main.py`: Python script to run the entire pipeline  
- `README.md`: Project overview and documentation

