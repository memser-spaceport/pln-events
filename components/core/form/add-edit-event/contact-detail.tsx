import { useState } from "react";

const ContactDetails = (props: any) => {
  const formData = props?.formData;
  const errorSections = props?.errorSections ?? [];
  const [contactDetails, setcontactDetails] = useState(
    formData?.contactDetails ?? [
      {
        contactName: "",
        contactEmail: "",
      },
    ]
  );

  const onAddContactClickHandler = () => {
    setcontactDetails([
      ...contactDetails,
      {
        contactName: "",
        contactEmail: "",
      },
    ]);
  };

  const handleChange = (event: any, index: any, key: any) => {
    const newContactDetails = [...contactDetails];
    newContactDetails[index][key] = event.target.value;
    setcontactDetails(newContactDetails);
  };

  const onRemoveClickHandler = (contactDetail: any, index: any) => {
    const newContactDetails = [...contactDetails];
    newContactDetails.splice(index, 1);
    setcontactDetails(newContactDetails);
  };

  return (
    <>
      <div
        className={`cdc ${
          errorSections.includes("contactDetails") ? "error" : ""
        }`}
      >
        <h2>Contact details</h2>
        {contactDetails.map((contactDetail: any, index: any) => (
          <div className="cdc__cd" key={index}>
            <input
              value={contactDetail.contactName}
              type="string"
              name="contactName"
              onChange={(e) => handleChange(e, index, "contactName")}
            />
            <input
              value={contactDetail.contactEmail}
              type="text"
              name="contactEmail"
              onChange={(e) => handleChange(e, index, "contactEmail")}
            />

            {index > 0 && (
              <button
                onClick={() => onRemoveClickHandler(contactDetail, index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={onAddContactClickHandler}>
          add
        </button>
      </div>

      <style jsx>
        {`
          .error {
            border: 1px solid red;
          }
          .cd {
            height: 200px;
          }

          .cdc__cd {
            display: flex;
            gap: 10px;
          }
        `}
      </style>
    </>
  );
};

export default ContactDetails;
