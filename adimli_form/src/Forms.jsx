import React, { useState } from 'react';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';

function Forms({ ekran, setIsFormValid, formData, setFormData }) {


    return (

        <div>
            {ekran === 1 && (

                <Form1 setIsFormValid={setIsFormValid} formData={formData} setFormData={setFormData} />

            )}

            {ekran === 2 && (

                <Form2 formData={formData} setFormData={setFormData} setIsFormValid={setIsFormValid} />

            )}

            {ekran === 3 && (

                <Form3 formData={formData} setFormData={setFormData} setIsFormValid={setIsFormValid} />

            )}

            {ekran === 4 && (

                <Form4 formData={formData} />

            )}
        </div>


    );

}

export default Forms;