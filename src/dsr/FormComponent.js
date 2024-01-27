import React, { useState } from 'react'

function FormComponent() {
    const [formData, setFormData] = useState({
        Month: '',
        LeadID: '',
        LeadCreationDate: '',
        ExecutiveName: '',
        Team: '',
        StudentName: '',
        CourseShortName: '',
        Specialization: '',
        AmountReceived: 0,
        DiscountAmount: 0,
        DiscountReason: '',
        StudyMaterial: '',
        StudyMaterialDiscount: '',
        AmountBilled: 0,
        PaymentMode: '',
        Accountdetails: '',
        PaymentOption: '',
        SaleDate: '',
        ContactNumber: '',
        EmailID: '',
        Sourcetype: '',
        Team2: '',
        PrimarySource: '',
        SecondarySource: '',
        LeadID2: '',
        Source: '',
        AgencySource: '',
        '1st payment amt': 0,
        EnrollmentId: '',
        Cohort: '',
        SecondarySource2: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:8000/api/saveFormData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Data saved successfully');
            } else {
                console.error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
    return (
        <>
            <div className='p-2 bg-primary text-white'>
                Add Admisstion Summery
            </div>
            <form onSubmit={handleSubmit} className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <label className="m-3">
                            Month:
                            <input
                                type="text"
                                name="Month"
                                value={formData.Month}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Lead ID:
                            <input
                                type="text"
                                name="LeadID"
                                value={formData.LeadID}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Lead Creation Date:
                            <input
                                type="date"
                                name="LeadCreationDate"
                                value={formData.LeadCreationDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Executive Name:
                            <input
                                type="text"
                                name="ExecutiveName"
                                value={formData.ExecutiveName}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Team:
                            <input
                                type="text"
                                name="Team"
                                value={formData.Team}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Student Name:
                            <input
                                type="text"
                                name="StudentName"
                                value={formData.StudentName}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Course Short Name:
                            <input
                                type="text"
                                name="CourseShortName"
                                value={formData.CourseShortName}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Specialization:
                            <input
                                type="text"
                                name="Specialization"
                                value={formData.Specialization}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>


                        <label className="m-3">
                            Amount Received:
                            <input
                                type="number"
                                name="AmountReceived"
                                value={formData.AmountReceived}
                                onChange={handleChange}
                                className="form-control"

                            />
                        </label>

                        <label className="m-3">
                            Discount Amount:
                            <input
                                type="number"
                                name="DiscountAmount"
                                value={formData.DiscountAmount}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Discount Reason:
                            <input
                                type="text"
                                name="DiscountReason"
                                value={formData.DiscountReason}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Study Material:
                            <input
                                type="text"
                                name="StudyMaterial"
                                value={formData.StudyMaterial}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Study Material Discount:
                            <input
                                type="text"
                                name="StudyMaterialDiscount"
                                value={formData.StudyMaterialDiscount}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Amount Billed:
                            <input
                                type="number"
                                name="AmountBilled"
                                value={formData.AmountBilled}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Payment Mode:
                            <input
                                type="text"
                                name="PaymentMode"
                                value={formData.PaymentMode}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Account Details:
                            <input
                                type="text"
                                name="Accountdetails"
                                value={formData.Accountdetails}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Payment Option:
                            <input
                                type="text"
                                name="PaymentOption"
                                value={formData.PaymentOption}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>
                    </div>


                    <div className='col-md-6'>
                        <label className="m-3">
                            Sale Date:
                            <input
                                type="date"
                                name="SaleDate"
                                value={formData.SaleDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Contact Number:
                            <input
                                type="text"
                                name="ContactNumber"
                                value={formData.ContactNumber}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Email ID:
                            <input
                                type="text"
                                name="EmailID"
                                value={formData.EmailID}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Source Type:
                            <input
                                type="text"
                                name="Sourcetype"
                                value={formData.Sourcetype}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Team 2:
                            <input
                                type="text"
                                name="Team2"
                                value={formData.Team2}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Primary Source:
                            <input
                                type="text"
                                name="PrimarySource"
                                value={formData.PrimarySource}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Secondary Source:
                            <input
                                type="text"
                                name="SecondarySource"
                                value={formData.SecondarySource}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Lead ID 2:
                            <input
                                type="text"
                                name="LeadID2"
                                value={formData.LeadID2}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Source:
                            <input
                                type="text"
                                name="Source"
                                value={formData.Source}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Agency Source:
                            <input
                                type="text"
                                name="AgencySource"
                                value={formData.AgencySource}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            1st Payment Amount:
                            <input
                                type="number"
                                name="1st payment amt"
                                value={formData['1st payment amt']}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Enrollment ID:
                            <input
                                type="text"
                                name="EnrollmentId"
                                value={formData.EnrollmentId}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Cohort:
                            <input
                                type="text"
                                name="Cohort"
                                value={formData.Cohort}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <label className="m-3">
                            Secondary Source 2:
                            <input
                                type="text"
                                name="SecondarySource2"
                                value={formData.SecondarySource2}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </label>

                        <button type="submit" className="btn btn-primary mt-3">
                            Save Data
                        </button>
                    </div>
                </div>
            </form>

        </>
    )
}

export default FormComponent