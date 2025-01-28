from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from helper import load_data, gen_user_vecs, print_pred_movies

def l2_normalize(x):
    return tf.linalg.l2_normalize(x, axis=1)

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('trained_model.h5', custom_objects={'l2_normalize': l2_normalize}, compile=False)

# Load and scale the data
item_train, user_train, y_train, item_features, user_features, item_vecs, movie_dict = load_data()
num_user_features = user_train.shape[1] - 3  # remove userid, rating count and ave rating during training
num_item_features = item_train.shape[1] - 1  # remove movie id at train time
uvs, ivs, u_s, i_s = 3, 3, 3, 1  # Indices for user and item feature vectors

# Initialize and fit scalers
scalerItem = StandardScaler()
scalerItem.fit(item_train)
item_train = scalerItem.transform(item_train)

scalerUser = StandardScaler()
scalerUser.fit(user_train)
user_train = scalerUser.transform(user_train)

scalerTarget = MinMaxScaler((-1, 1))
scalerTarget.fit(y_train.reshape(-1, 1))
y_train = scalerTarget.transform(y_train.reshape(-1, 1))

default = {
    "id": 5000,
    "avg": 0.0,
    "Action": 3.4,
    "Adventure": 3.4,
    "Animation": 3.6,
    "Children": 3.4,
    "Comedy": 3.4,
    "Crime": 3.5,
    "Documentary": 3.8,
    "Drama": 3.6,
    "Fantasy": 3.4,
    "Horror": 3.2,
    "Mystery": 3.6,
    "Romance": 3.4,
    "Sci-Fi": 3.4,
    "Thriller": 3.4,
    "rating_count": 3.0
}

def movies_predict(user_vec):
    """
    Predicts the top 10 movies for a given user vector.
    """
    user_vecs = gen_user_vecs(user_vec, len(item_vecs))
    suser_vecs = scalerUser.transform(user_vecs)
    sitem_vecs = scalerItem.transform(item_vecs)
    
    # Make a prediction
    y_p = model.predict([suser_vecs[:, u_s:], sitem_vecs[:, i_s:]])
    
    # Unscale y prediction
    y_pu = scalerTarget.inverse_transform(y_p)
    
    # Sort the results, highest prediction first
    sorted_index = np.argsort(-y_pu, axis=0).reshape(-1).tolist()  # Negate to get largest rating first
    sorted_ypu = y_pu[sorted_index]
    sorted_items = item_vecs[sorted_index]
    
    return print_pred_movies(sorted_ypu, sorted_items, movie_dict, maxcount=10)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        user_data = request.get_json()
        data = list(default.values())
        keys = list(default.keys())
        
        # Update data based on user input
        for i in user_data['user_vec']:
            if i in default:
                index = keys.index(i)
                data[index] = 5
                
        user_vec = np.array(data).reshape(1, -1)  # Ensure input is in the correct shape
        predictions = movies_predict(user_vec)  # Call the prediction function
        print(predictions)
        return jsonify({"predictions": predictions})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)