import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminProduct.css";

const API = `${import.meta.env.VITE_API_URL}/products`;

const Addproduct = () => {
  const [form, setForm] = useState({
    frontImg: null,
    backImg: null,
    additionalImages: [null, null],
    video: null,
    mrp: "",
    discountPercentage: "",
    rating: "",
    title: "",
    category: "",
    description: "",
    stock: "",
    karatage: "",
    metalColor: "",
    grossWeight: "",
    metal: "",
    variantGroup: "",
    gender: "",
    occasion: "",
    collection: ""
  });

  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    back: null,
    additional: [null, null],
    video: null
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  const id = new URLSearchParams(location.search).get("id");

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // LOAD PRODUCT WHEN EDITING
  useEffect(() => {
    if (id) {
      axios.get(`${API}/${id}`).then((res) => {
        setForm({
          frontImg: null,
          backImg: null,
          additionalImages: [null, null],
          video: null,
          // Load MRP from existing data (price + discount = MRP)
          mrp: res.data.price + (res.data.discount || 0),
          discountPercentage: res.data.discountPercentage,
          rating: res.data.rating,
          title: res.data.title,
          category: res.data.category?._id || res.data.category || "",
          description: res.data.description || "",
          stock: res.data.stock || 0,
          karatage: res.data.karatage || "",
          metalColor: res.data.metalColor || "",
          grossWeight: res.data.grossWeight || "",
          metal: res.data.metal || "",
          variantGroup: res.data.variantGroup || "",
          gender: res.data.gender || "",
          occasion: res.data.occasion || "",
          collection: res.data.collection || ""
        });
        
        // Set existing image previews
        const additionalPreviews = [null, null];
        if (res.data.additionalImages && res.data.additionalImages.length > 0) {
          res.data.additionalImages.forEach((img, index) => {
            if (index < 2) {
              additionalPreviews[index] = `${import.meta.env.VITE_API_IMAGE}/${img}`;
            }
          });
        }
        
        setImagePreviews({
          front: `${import.meta.env.VITE_API_IMAGE}/${res.data.frontImg}`,
          back: `${import.meta.env.VITE_API_IMAGE}/${res.data.backImg}`,
          additional: additionalPreviews,
          video: res.data.video ? `${import.meta.env.VITE_API_IMAGE}/${res.data.video}` : null
        });
      });
    }
  }, [id]);

  // Handle image preview
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'front') {
          setImagePreviews(prev => ({ ...prev, front: reader.result }));
          setForm({ ...form, frontImg: file });
        } else if (type === 'back') {
          setImagePreviews(prev => ({ ...prev, back: reader.result }));
          setForm({ ...form, backImg: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle individual additional image
  const handleAdditionalImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews.additional];
        newPreviews[index] = reader.result;
        setImagePreviews(prev => ({ ...prev, additional: newPreviews }));
        
        const newImages = [...form.additionalImages];
        newImages[index] = file;
        setForm({ ...form, additionalImages: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
      setForm(prev => ({ ...prev, video: file }));
    }
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    
    // Only append images if they are new (not null)
    if (form.frontImg) {
      fd.append("frontImg", form.frontImg);
    }
    if (form.backImg) {
      fd.append("backImg", form.backImg);
    }
    
    // Append additional images (only non-null ones)
    form.additionalImages.forEach((img) => {
      if (img) fd.append(`additionalImages`, img);
    });

    // Append video if selected
    if (form.video) {
      fd.append("video", form.video);
    }
    
    // Auto-calculate selling price and discount from MRP + discount%
    const mrp = parseFloat(form.mrp) || 0;
    const discPct = parseFloat(form.discountPercentage) || 0;
    const sellingPrice = Math.round(mrp - (mrp * discPct / 100));
    const discountAmt = mrp - sellingPrice;

    fd.append("price", sellingPrice);
    fd.append("discount", discountAmt);
    fd.append("rating", form.rating);
    fd.append("discountPercentage", discPct);
    fd.append("title", form.title);
    fd.append("category", form.category);
    fd.append("description", form.description);
    fd.append("stock", form.stock);
    fd.append("karatage", form.karatage);
    fd.append("metalColor", form.metalColor);
    fd.append("grossWeight", form.grossWeight);
    fd.append("metal", form.metal);
    fd.append("variantGroup", form.variantGroup);
    fd.append("gender", form.gender);
    fd.append("occasion", form.occasion);
    fd.append("collection", form.collection);

    try {
      if (!id) {
        await axios.post(`${API}/add`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(`${API}/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/adminproducts");

    } catch (err) {
      console.error("Submit Error", err);
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  return (
    <div className="add-product-container">
      <form className="product-form-compact" onSubmit={handleSubmit}>
        <h2 className="form-title">{id ? "Update Product" : "Add New Product"}</h2>

        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <label>Product Title *</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occasion</label>
                <select value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                  <option value="">Select Occasion</option>
                  <option value="Party Wear">Party Wear</option>
                  <option value="Daily Wear">Daily Wear</option>
                  <option value="Festive Collections">Festive Collections</option>
                  <option value="Wedding Collections">Wedding Collections</option>
                </select>
              </div>
              <div className="form-group">
                <label>Collection</label>
                <select value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })}>
                  <option value="">Select Collection</option>
                  <option value="Statement Collections">Statement Collections</option>
                  <option value="Vintage Collections">Vintage Collections</option>
                  <option value="Luxury Collections">Luxury Collections</option>
                  <option value="Branded Collections">Branded Collections</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>MRP (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={form.mrp}
                  onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Discount % *</label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  min="0" max="100"
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0-5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Auto-calculated selling price preview */}
            {form.mrp && form.discountPercentage && (
              <div className="form-group">
                <label>Selling Price (auto-calculated)</label>
                <div style={{padding:'9px 12px', background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:'8px', fontSize:'15px', fontWeight:'700', color:'#15803d'}}>
                  ₹{Math.round(parseFloat(form.mrp) - (parseFloat(form.mrp) * parseFloat(form.discountPercentage) / 100))}
                  <span style={{fontSize:'12px', fontWeight:'400', color:'#6b7280', marginLeft:'10px'}}>
                    (Save ₹{Math.round(parseFloat(form.mrp) * parseFloat(form.discountPercentage) / 100)} off MRP ₹{form.mrp})
                  </span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Stock / Units *</label>
              <input
                type="number"
                min="0"
                placeholder="Enter available stock quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>

            {/* Metal Details */}
            <div className="metal-details-section">
              <h3 className="metal-section-title">
                <i className="fa-solid fa-gem me-2"></i> Metal Details
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Karatage</label>
                  <select
                    value={form.karatage}
                    onChange={(e) => setForm({ ...form, karatage: e.target.value })}
                  >
                    <option value="">Select Karatage</option>
                    <option value="14K">14K</option>
                    <option value="18K">18K</option>
                    <option value="20K">20K</option>
                    <option value="22K">22K</option>
                    <option value="24K">24K</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Metal</label>
                  <select
                    value={form.metal}
                    onChange={(e) => setForm({ ...form, metal: e.target.value })}
                  >
                    <option value="">Select Metal</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="White Gold">White Gold</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Material Colour</label>
                  <select
                    value={form.metalColor}
                    onChange={(e) => setForm({ ...form, metalColor: e.target.value })}
                  >
                    <option value="">Select Colour</option>
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="White Gold">White Gold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Gross Weight (g)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.588g"
                    value={form.grossWeight}
                    onChange={(e) => setForm({ ...form, grossWeight: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Variant Group <span style={{fontWeight:400, color:'#9ca3af'}}>(same name links color variants together, e.g. "ring-001")</span></label>
                <input
                  type="text"
                  placeholder="e.g. ring-001"
                  value={form.variantGroup}
                  onChange={(e) => setForm({ ...form, variantGroup: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="form-column">
            <div className="images-section">
              <h3>Product Images</h3>
              
              <div className="image-upload-row">
                <div className="image-upload-box">
                  <label>Front Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'front')}
                    required={!id}
                  />
                  {imagePreviews.front && (
                    <img src={imagePreviews.front} alt="Front preview" className="image-preview" />
                  )}
                </div>

                <div className="image-upload-box">
                  <label>Back Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'back')}
                    required={!id}
                  />
                  {imagePreviews.back && (
                    <img src={imagePreviews.back} alt="Back preview" className="image-preview" />
                  )}
                </div>
              </div>

              <div className="additional-images">
                <label>Additional Images (Optional)</label>
                <div className="additional-images-grid">
                  {form.additionalImages.map((img, index) => (
                    <div key={index} className="additional-image-slot">
                      <label className="slot-label">Image {index + 1}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageChange(e, index)}
                        className="file-input-slot"
                      />
                      {imagePreviews.additional[index] && (
                        <div className="slot-preview">
                          <img src={imagePreviews.additional[index]} alt={`Additional ${index + 1}`} />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Video/GIF Upload Slot */}
                  <div className="additional-image-slot video-slot">
                    <label className="slot-label">
                      <i className="fa-solid fa-video me-1"></i> Video / GIF (Optional)
                    </label>
                    <input
                      type="file"
                      accept="video/*,image/gif"
                      onChange={handleVideoChange}
                      className="file-input-slot"
                    />
                    {imagePreviews.video && (
                      <div className="slot-preview video-preview">
                        {imagePreviews.video.endsWith('.gif') || form.video?.type === 'image/gif'
                          ? <img src={imagePreviews.video} alt="GIF preview" style={{width:'100%', borderRadius:'8px'}} />
                          : <video src={imagePreviews.video} controls muted />
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            <i className="fa-solid fa-check me-2"></i>
            {id ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({
                frontImg: null,
                backImg: null,
                additionalImages: [null, null],
                video: null,
                mrp: "",
                discountPercentage: "",
                rating: "",
                title: "",
                category: "",
                description: "",
                stock: "",
                karatage: "",
                metalColor: "",
                grossWeight: "",
                metal: "",
                variantGroup: "",
                gender: "",
                occasion: "",
                collection: ""
              });
              setImagePreviews({ front: null, back: null, additional: [null, null], video: null });
            }}
            className="btn-reset"
          >
            <i className="fa-solid fa-rotate-right me-2"></i>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addproduct;
