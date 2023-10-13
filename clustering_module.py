from sklearn.cluster import KMeans
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def perform_clustering(data):
    # Convert data to DataFrame
    df = pd.DataFrame(data)

    # Drop unwanted columns
    df = df.drop(["customerID", "Churn"], axis=1)
    df = df.dropna(axis=0)
    # Handle missing data in TotalCharges
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    imputer = SimpleImputer(strategy='mean')
    df['TotalCharges'] = imputer.fit_transform(df[['TotalCharges']])

    # Separate numerical and categorical columns
    numerical_cols = df.select_dtypes(include='number').columns
    categorical_cols = df.select_dtypes(include='object').columns

    # Create a column transformer to preprocess numerical and categorical columns
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),  # Standardize numerical features
            ('cat', OneHotEncoder(), categorical_cols)  # One-hot encode categorical features
        ])

    # Create a pipeline with preprocessing and clustering steps
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('clusterer', KMeans(n_clusters=2, random_state=27))  # Example: KMeans clustering with 3 clusters
    ])

    # Fit and predict clusters
    clusters = pipeline.fit_predict(df)
    return clusters.tolist()
