import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fee, setFee] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const {backendUrl,aToken} = useContext(AdminContext)


  const onSubmitHandler = async (event) => {
  event.preventDefault();
  try {
    if (!docImg) {
      return toast.error("Image Not Selected");
    }

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fee));
    formData.append("speciality", speciality);
    formData.append("degree", education);
    formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
    formData.append("about", about);

    // Send the POST request only once with full formData
    const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
      headers: {
        aToken,
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success) {
      toast.success(data.message);
      setDocImg(false);
      setName("");
      setEmail("");
      setPassword("");
      setFee("");
      setEducation("");
      setAddress1("");
      setAddress2("");
      setAbout("");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Add doctor error:", error);
    toast.error("Something went wrong while adding doctor.");
  }
};

  
  return (
    <form onSubmit={onSubmitHandler} className="m-6 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-5 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 object-cover bg-gray-100 cursor-pointer rounded-full"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-1">Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <p className="mb-1">Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <p className="mb-1">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <p className="mb-1">Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i}>{i + 1} Year</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1">Fee</p>
              <input
                onChange={(e) => setFee(e.target.value)}
                value={fee}
                type="number"
                placeholder="Fee"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="w-full">
              <p className="mb-1">About Doctor</p>
              <textarea
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                placeholder="Write about doctor"
                rows={5}
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              Add Doctor
            </button>
          </div>

          <div className="space-y-4 w-full">
            <div>
              <p className="mb-1">Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>
            <div>
              <p className="mb-1">Education</p>
              <input
                onChange={(e) => setEducation(e.target.value)}
                value={education}
                type="text"
                placeholder="Education"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <p className="mb-1">Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address 2"
                required
                className="w-full bg-gray-100 px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
