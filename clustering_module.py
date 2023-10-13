from sklearn.cluster import KMeans
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def perform_clustering(data):
    df = pd.DataFrame(data)
    df = df.drop(["customerID", "Churn"], axis=1)
    df = df.dropna(axis=0)
    
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    imputer = SimpleImputer(strategy='mean')
    df['TotalCharges'] = imputer.fit_transform(df[['TotalCharges']])

    
    numerical_cols = df.select_dtypes(include='number').columns
    categorical_cols = df.select_dtypes(include='object').columns

    # Create a column transformer to preprocess numerical and categorical columns
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),  # Standardize
            ('cat', OneHotEncoder(), categorical_cols)  # One-hot encode
        ])
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('clusterer', KMeans(n_clusters=2, random_state=27))  
    ])

    # Fit and predict clusters
    clusters = pipeline.fit_predict(df)
    return clusters.tolist()
