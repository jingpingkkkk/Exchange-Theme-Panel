import { CButton, CCol, CForm, CFormLabel, CSpinner } from "@coreui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormInput from "../../../components/Common/FormComponents/FormInput"; // Import the FormInput component
import FormInputWithIcon from "../../../components/Common/FormComponents/FormInputWithIcon";
import FormTextarea from "../../../components/Common/FormComponents/FormTextarea";
import { Notify } from "../../../utils/notify";
import "../themeSettingForm.css";
import {
  getThemeSettingById,
  removeImage,
  updateThemeSetting,
} from "../themeSettingService";

const validationSchemaForCreate = Yup.object({
  facebookLink: Yup.string().required("Facebook is required"),
});

const validationSchemaForUpdate = Yup.object({
  facebookLink: Yup.string().required("Facebook is required"),
  twitterLink: Yup.string().required("Twitter is required"),
  instagramLink: Yup.string().required("Instagram is required"),
  telegramLink: Yup.string().required("Telegram is required"),
  youtubeLink: Yup.string().required("Youtube is required"),
  whatsappLink: Yup.string().required("Facebook is required"),
  blogLink: Yup.string().required("Feed is required"),
  footerMessage: Yup.string().required("Footer Message is required"),
  news: Yup.string().required("News is required"),
  supportNumber: Yup.string().required("Support number is required"),
  forgotPasswordLink: Yup.string().required("Forgot password link is required"),
  depositePopupNumber: Yup.string().required("Deposite popup number"),
  welcomeMessage: Yup.string(),
  welcomeMessageMobile: Yup.string(),
});

export default function ThemeSettingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId =
    JSON.parse(localStorage.getItem("user_info")).superUserId || {};
  //const id = location.state ? location.state.id : null;

  const editMode = !!userId;
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverMsg, setServerMsg] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [themeUserSettingId, setThemeUserSettingId] = useState("");

  const [welcomeMobileImageFile, setWelcomeMobileImageFile] = useState(null);
  const [welcomeDesktopImageFile, setWelcomeDesktopImageFile] = useState(null);
  const [logoImageFile, setLogoImageFile] = useState(null);

  const [welcomeMobileImageUrl, setWelcomeMobileImageUrl] = useState("");
  const [welcomeDesktopImageUrl, setWelcomeDesktopImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");

  const user = {
    facebookLink: "",
    twitterLink: "",
    instagramLink: "",
    telegramLink: "",
    youtubeLink: "",
    whatsappLink: "",
    blogLink: "",
    footerMessage: "",
    news: "",
    supportNumber: "",
    forgotPasswordLink: "",
    depositePopupNumber: "",
    welcomeMessage: "",
    welcomeMessageMobile: "",
  };
  const handleImageUpload = (acceptedFiles) => {
    //setImageFiles(acceptedFiles);

    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: "",
      url: URL.createObjectURL(file), // Generate URL for new image
    }));

    setImageFiles((prevImageFiles) => [...prevImageFiles, ...newFiles]);
    //setImageFiles((prevImageFiles) => [...prevImageFiles, ...acceptedFiles]);
  };

  const handleRemoveImage = async (indexToRemove, name) => {
    console.log(name);
    console.log(themeUserSettingId);
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
    if (name !== "") {
      // delete API call
      let removeImageObj = {
        _id: themeUserSettingId,
        bannerImageName: name,
      };
      let response = await removeImage(removeImageObj);
    }
  };

  const handleSingleImageUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    const newImageUrl = URL.createObjectURL(file);
    if (fieldName === "welcomeMobileImage") {
      setWelcomeMobileImageUrl(newImageUrl);
      setWelcomeMobileImageFile(file);
    } else if (fieldName === "welcomeDesktopImage") {
      setWelcomeDesktopImageUrl(newImageUrl);
      setWelcomeDesktopImageFile(file);
    } else if (fieldName === "logo") {
      setLogoImageUrl(newImageUrl);
      setLogoImageFile(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleImageUpload,
  });

  const submitForm = async (values) => {
    setServerError(null);
    setLoading(true);

    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append("userId", userId);

      // Append form values to FormData
      for (const key in values) {
        formData.append(key, values[key]);
      }

      // Append image files to FormData
      imageFiles.forEach((fileObj, index) => {
        formData.append(`bannerImages[${index}]`, fileObj.file);
      });

      if (welcomeMobileImageFile) {
        formData.append("welcomeMobileImage", welcomeMobileImageFile);
      }

      if (welcomeDesktopImageFile) {
        formData.append("welcomeDesktopImage", welcomeDesktopImageFile);
      }

      if (logoImageFile) {
        formData.append("logo", logoImageFile);
      }

      let response = await updateThemeSetting(formData);
      if (response.success) {
        Notify.success("Theme setting updated successfully.");
        fetchAndUpdateFormData();
        //setServerMsg('Data Updated successfully!!');
        //navigate("/dashboard/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndUpdateFormData = async () => {
    Promise.all([getThemeSettingById(userId)]).then((results) => {
      const [fetchtedUser] = results;
      if (fetchtedUser) {
        const result = fetchtedUser;
        formik.setValues((prevValues) => ({
          ...prevValues,
          facebookLink: result.facebookLink || "",
          twitterLink: result.twitterLink || "",
          instagramLink: result.instagramLink || "",
          telegramLink: result.telegramLink || "",
          youtubeLink: result.youtubeLink || "",
          whatsappLink: result.whatsappLink || "",
          blogLink: result.blogLink || "",
          footerMessage: result.footerMessage || "",
          news: result.news || "",
          supportNumber: result.supportNumber || "",
          forgotPasswordLink: result.forgotPasswordLink || "",
          depositePopupNumber: result.depositePopupNumber || "",
          welcomeMessage: result.welcomeMessage || "",
          welcomeMessageMobile: result.welcomeMessageMobile || "",
        }));

        setImageFiles(fetchtedUser.bannerImages);
        setThemeUserSettingId(result._id);
        setWelcomeMobileImageUrl(fetchtedUser.welcomeMobileImage);
        setWelcomeDesktopImageUrl(fetchtedUser.welcomeDesktopImage);
        setLogoImageUrl(fetchtedUser.logo);
      }
    });
  };

  const formik = useFormik({
    initialValues: user,
    validationSchema: editMode
      ? validationSchemaForUpdate
      : validationSchemaForCreate,
    onSubmit: submitForm,
  });

  useEffect(() => {
    fetchAndUpdateFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const formTitle = "UPDATE THEME SETTING";

  return (
    <div>
      <div className="page-header mb-3">
        <h1 className="page-title">{formTitle}</h1>
      </div>

      <Card>
        <Card.Header>
          <h3 className="card-title">Social Integration </h3>
        </Card.Header>

        <Card.Body>
          <CForm
            className="row g-3 needs-validation"
            onSubmit={formik.handleSubmit}
          >
            {serverError ? <p className="text-red">{serverError}</p> : null}
            {serverMsg ? <p className="text-green">{serverMsg}</p> : null}

            <FormInputWithIcon
              label="Facebook"
              name="facebookLink" // Make sure to change the name accordingly for each social media input
              type="text"
              value={formik.values.facebookLink} // Adjust the value and onChange for each social media input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.facebookLink && formik.errors.facebookLink}
              isRequired={true}
              width={4}
              icon="fa fa-facebook"
            />

            <FormInputWithIcon
              label="Twitter"
              name="twitterLink"
              type="text"
              value={formik.values.twitterLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.twitterLink && formik.errors.twitterLink}
              isRequired={true}
              width={4}
              icon="fa fa-twitter"
            />

            <FormInputWithIcon
              label="Instagram"
              name="instagramLink"
              type="text"
              value={formik.values.instagramLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.instagramLink && formik.errors.instagramLink
              }
              isRequired={true}
              width={4}
              icon="fa fa-instagram"
            />

            <FormInputWithIcon
              label="Telegram"
              name="telegramLink"
              type="text"
              value={formik.values.telegramLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telegramLink && formik.errors.telegramLink}
              isRequired={true}
              width={4}
              icon="fa fa-telegram"
            />

            <FormInputWithIcon
              label="Youtube"
              name="youtubeLink"
              type="text"
              value={formik.values.youtubeLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.youtubeLink && formik.errors.youtubeLink}
              isRequired={true}
              width={4}
              icon="fa fa-youtube"
            />

            <FormInputWithIcon
              label="Whatsapp"
              name="whatsappLink"
              type="text"
              value={formik.values.whatsappLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.whatsappLink && formik.errors.whatsappLink}
              isRequired={true}
              width={4}
              icon="fa fa-whatsapp"
            />

            <FormInputWithIcon
              label="Feed"
              name="blogLink"
              type="text"
              value={formik.values.blogLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.blogLink && formik.errors.blogLink}
              isRequired={true}
              width={4}
              icon="fa fa-feed"
            />

            <CCol md={8} />

            <CCol md="4">
              <CFormLabel htmlFor="">Logo</CFormLabel>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(event) => handleSingleImageUpload(event, "logo")}
              />
            </CCol>
            <CCol md="2">
              {logoImageUrl && (
                <div className="image-preview">
                  <img src={logoImageUrl} alt="Logo" />
                </div>
              )}
            </CCol>
            <CCol md={6} />

            <FormInput
              label="Welcome Desktop Image Title"
              name="welcomeMessage"
              type="text"
              value={formik.values.welcomeMessage}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              error={
                formik.touched.welcomeMessage && formik.errors.welcomeMessage
              }
              isRequired={true}
              width={4}
            />

            <CCol md="3">
              <CFormLabel htmlFor="">Welcome Mobile Image</CFormLabel>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(event) =>
                  handleSingleImageUpload(event, "welcomeMobileImage")
                }
              />
            </CCol>

            <CCol md="2">
              {welcomeMobileImageUrl && (
                <div className="image-preview">
                  <img src={welcomeMobileImageUrl} alt="Welcome Mobile" />
                </div>
              )}
            </CCol>

            <CCol md={3} />

            <FormInput
              label="Welcome Desktop Image Title"
              name="welcomeMessageMobile"
              type="text"
              value={formik.values.welcomeMessageMobile}
              onChange={formik.handleChange}
              // onBlur={formik.handleBlur}
              error={
                formik.touched.welcomeMessageMobile &&
                formik.errors.welcomeMessage
              }
              isRequired={true}
              width={4}
            />

            <CCol md="3">
              <CFormLabel htmlFor="">Welcome Desktop Image</CFormLabel>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(event) =>
                  handleSingleImageUpload(event, "welcomeDesktopImage")
                }
              />
            </CCol>
            <CCol md="2">
              {welcomeDesktopImageUrl && (
                <div className="image-preview">
                  <img src={welcomeDesktopImageUrl} alt="Welcome Desktop" />
                </div>
              )}
            </CCol>

            <div className="mb-3">
              <label>Upload Images</label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} /> {/* Use inputRef here */}
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>

              <div className="image-preview-container mt-2">
                {imageFiles.map((fileObj, index) => (
                  <div key={index} className="image-preview">
                    <img src={fileObj.url} alt={`Uploaded ${index + 1}`} />
                    <div className="image-overlay">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, fileObj.name)}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <small
                className="form-text text-muted"
                style={{ fontSize: "12px", color: "#999" }}
              >
                Accepted formats: PNG, JPEG, GIF
              </small>
            </div>

            <div className="mt-4 mb-1">
              <hr />
            </div>

            {/* <div className="expanel expanel-default">
              <div className="expanel-heading">
                <h3 className="expanel-title">Settings</h3>
              </div>
              <div className="expanel-body">Panel content</div>
            </div> */}

            <Card.Header className="bg-primary text-white">
              <h3 className="card-title">Others </h3>
            </Card.Header>

            <FormTextarea
              label="Footer Message"
              name="footerMessage"
              value={formik.values.footerMessage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.footerMessage && formik.errors.footerMessage
              }
              isRequired="true"
              width={6}
            />

            <FormTextarea
              label="News"
              name="news"
              value={formik.values.news}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.news && formik.errors.news}
              isRequired="true"
              width={6}
            />

            <FormInput
              label="Support number"
              name="supportNumber"
              type="text"
              value={formik.values.supportNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.supportNumber && formik.errors.supportNumber
              }
              isRequired="true"
              width={4}
            />

            <FormInput
              label="Forgot Password Link"
              name="forgotPasswordLink"
              type="text"
              value={formik.values.forgotPasswordLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.forgotPasswordLink &&
                formik.errors.forgotPasswordLink
              }
              isRequired="true"
              width={4}
            />

            <FormInput
              label="Deposite popup number"
              name="depositePopupNumber"
              type="text"
              value={formik.values.depositePopupNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.depositePopupNumber &&
                formik.errors.depositePopupNumber
              }
              isRequired="true"
              width={4}
            />

            <CCol xs={12} className="pt-3">
              <div className="d-grid gap-2 d-md-block">
                <CButton color="primary" type="submit" className="me-md-3">
                  {loading ? (
                    <CSpinner size="sm" />
                  ) : editMode ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </CButton>
              </div>
            </CCol>
          </CForm>
        </Card.Body>
      </Card>
    </div>
  );
}
