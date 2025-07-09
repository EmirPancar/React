import React from "react";

function Cmp1(props){

    return(

        <div> 
            <table border="4px">
                <thead>
                        <tr>
                            <th>Ürün</th>
                            <th>Fiyat</th>

                        </tr>

                </thead>

                <tbody>
                        {props.urunler.map((urun,index) => 

                            <tr key={index}>
                                <td>{urun.cesit}</td>
                                <td>{urun.fiyat}</td>
                            </tr>
                        
                        )}
                        

                </tbody>

            </table>

        </div>

    );

}

export default Cmp1;