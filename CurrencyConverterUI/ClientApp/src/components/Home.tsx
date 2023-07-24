import * as React from 'react';
import { connect } from 'react-redux';
import { useState } from "react";

const Home = () => {
    const [baseCurrencyType, setBaseCurrencyType] = useState("");
    const [targetCurrencyType, setTargetCurrencyType] = useState("");
    const [baseAmount, setBaseAmount] = useState("");
    const [targetAmount, setTargetAmount] = useState("");

    const [apiType, setApiType] = useState("");

    const handleBaseAmount = (e: any) => {
        setBaseAmount(e.target.value);
        setBaseAmountMessage("");
    }

    const handleApiType = (e: any) => {
        
        setApiType(e.target.value);
        setApiTypeErrorMessage("");
    }
    const handleBaseCurrencyType = (e: any) => {
       
        setBaseCurrencyType(e.target.value);
        setBaseCurrencyTypeMessage("");
        setTargetCurrencyTypeMessage("");
    }
    const handleTargetCurrencyType = (e: any) => {
        setTargetCurrencyType(e.target.value);
        setTargetCurrencyTypeMessage("");
    }
    const [apiResponsemessage, setApiResponsemessage] = useState("");

    const [baseAmountErrorMessage, setBaseAmountMessage] = useState("");
    const [baseCurrencyTypeErrorMessage, setBaseCurrencyTypeMessage] = useState("");
    const [targetCurrencyTypeErrorMessage, setTargetCurrencyTypeMessage] = useState("");
    const [apiTypeErrorMessage, setApiTypeErrorMessage] = useState("");

    const [cssClassMessage, setCssClassMessage] = useState("");

    const validateApiType = (type: any) => {
        if (type !== "public" && type !== "corporate") {
            setCssClassMessage('message alert alert-danger');
            setApiTypeErrorMessage("Please select a valid converter type");
            return false;
        }
    }

    const validateBaseCurrencyType = (baseCurrencyType: string) => {
        if (baseCurrencyType === "" || baseCurrencyType === '0') {
            setBaseCurrencyTypeMessage("Please select a valid base currency");
            setCssClassMessage('message alert alert-danger');
            setApiResponsemessage("");
            return false;
        }
    }
    const validateTargetCurrencyType = (targetCurrencyType: string) => {
        if (baseCurrencyType === targetCurrencyType) {
            setTargetCurrencyTypeMessage("Please select a different target currency than base currency");
            setCssClassMessage('message alert alert-danger');
            setApiResponsemessage("");
            return false;
        }

        if (targetCurrencyType === "" || targetCurrencyType === '0') {
            setTargetCurrencyTypeMessage("Please select a valid target currency");
            setCssClassMessage('message alert alert-danger');
            setApiResponsemessage("");
            return false;
        }
    }

    const validateBaseAmount = (baseAmount: string) => {
        const cvvRegex = /^[0-9\b]+$/;
        if (baseAmount === '' || cvvRegex.test(baseAmount) === false) {
            setBaseAmountMessage("Please enter valid amount");
            setCssClassMessage('message alert alert-danger');
            setApiResponsemessage("");
            return false;
        }
    }

    let handleSubmit = async (e: any) => {
        e.preventDefault();

        if (validateApiType(apiType) === false || validateBaseCurrencyType(baseCurrencyType) === false || validateBaseAmount(baseAmount) === false || validateTargetCurrencyType(targetCurrencyType) === false)
            return;

        let callingApiURL = apiType === "corporate" ? "http://localhost:5112/CorporateCurrencyConversionApi" : "http://localhost:5112/PublicCurrencyConversionApi";

        let formData = new FormData();

        formData.append("BaseCurrency", baseCurrencyType);
        formData.append("TargetCurrency", targetCurrencyType);
        formData.append("InputAmount", baseAmount);

        try {
            let res = await fetch(callingApiURL, {
                method: "POST",
                body: formData
            });
            
            let resJson = await res.json();
            setTargetAmount(resJson);
            if (resJson === 0) {
                setApiResponsemessage('Error when converting to' + targetCurrencyType)
                setCssClassMessage('message alert alert-danger');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={'form'}>
            <div className={'form-group'}>
                <h1>Currency Converter</h1>
            </div>
            <div className={'form-group'}>
                <div className={'row'}>
                    <div className={'column'} id={apiType}>
                        <span style={{ marginRight: '20px' }}><input type="radio" value="public" name="converterType" onChange={handleApiType} /> Public Converter</span>
                        <span><input type="radio" value="corporate" name="converterType" onChange={handleApiType} /> Corporate Converter</span>
                    </div>
                </div>
                {apiTypeErrorMessage ?
                    <div className={'row'}>
                        <div className={cssClassMessage} style={{ width: '400px' }}><p>{apiTypeErrorMessage}</p></div>
                    </div> : null
                }
            </div>
            <div className={'form-group'}>
            </div>
            <div className={'form-group'}>
                <div className={'row'}>
                    <div className={'column'} style={{ marginRight: '20px', width: '200px' }} id={baseCurrencyType} onChange={(e) => handleBaseCurrencyType(e)}>
                        <label>Base Currency</label>
                        <select className={'form-control'} defaultValue={0}>
                            <option value="0">Please select a currency type</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                        {baseCurrencyTypeErrorMessage ?

                            <div className={cssClassMessage} style={{ width: '200px' }}><p>{baseCurrencyTypeErrorMessage}</p></div> : null
                        }
                    </div>
                    <div className={'column'} style={{ marginRight: '100px', width: '100px' }} >
                        <label>Amount</label>
                        <input type="text" id={baseAmount} className={'form-control'} onChange={(e) => handleBaseAmount(e)} placeholder="Ex:123"></input>
                        {baseAmountErrorMessage ?

                            <div className={cssClassMessage} style={{ width: '100px' }}><p>{baseAmountErrorMessage}</p></div> : null

                        }
                    </div>
                    <div className={'column'} style={{ marginRight: '20px', width: '200px' }} id={targetCurrencyType} onChange={(e) => handleTargetCurrencyType(e)}>
                        <label>Target Currency</label>
                        <select className={'form-control'} defaultValue={0}>
                            <option value="0">Please select a currency type</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                        {targetCurrencyTypeErrorMessage ?

                            <div className={cssClassMessage} style={{ width: '200px' }}><p>{targetCurrencyTypeErrorMessage}</p></div> : null
                        }
                    </div>
                    <div className={'column'} style={{ marginRight: '50px', width: '100px' }} >
                        <label>Amount</label>
                        <input type="text" id={targetAmount} className={'form-control'} value={targetAmount} readOnly={true}></input>
                    </div>
                </div>
            </div>

            <div className={'form-group'}>
                <div className={'row'}>
                    <div className={'column'}>
                        <button type="submit" className="btn btn-primary btn-lg">
                            Convert
                        </button>
                    </div>


                </div>
            </div>
            {apiResponsemessage ?
                <div className={'form-group'}>
                    <div className={cssClassMessage} style={{ width: '495px' }}><p>{apiResponsemessage}</p></div>
                </div> : null
            }
        </form>
    );
}

export default connect()(Home);
