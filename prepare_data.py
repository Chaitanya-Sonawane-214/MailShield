import pandas as pd

df = pd.read_csv("data/text/Phishing_Email.csv")

# Rename columns
df = df.rename(columns={
    "Email Text": "body",
    "Email Type": "label"
})

# Drop empty rows
df = df.dropna(subset=["body", "label"])

# Convert label to 0 and 1
df["label"] = df["label"].map({
    "Phishing Email": 1,
    "Safe Email": 0
})

# Keep only needed columns
df = df[["body", "label"]]

# Save
df.to_csv("data/text/combined_reduced.csv", index=False)

print("Done!")
print(df["label"].value_counts())
print("Total rows:", len(df))