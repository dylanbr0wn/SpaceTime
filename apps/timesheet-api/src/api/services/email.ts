import nodemailer from "nodemailer";
import config from "../../config/config";
import {
  readEmployeePreferences,
  readEmployeeSupervisor,
} from "../database/employeeDB";
import moment from "moment";
import { getTotalHours } from "./utils";
import { Preference, TimeEntry } from "./types";

// Dispatches a test email using ethereal mail
const dispatchTestMail = async (
  receivers: string[],
  subject: string,
  body: string
) => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const mailOptions = {
      from: config.mail_creds.from_address, // sender address
      to: receivers, // list of receivers
      subject, // Subject line,
      html: body,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error(err);
  }
};

// Dispatches an email using the langford mail relay
export const dispatchSubmissionEmail = async (
  receivers: string[],
  subject: string,
  body: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.mail_creds.host,
      port: config.mail_creds.port,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: config.mail_creds.from_address, // sender address
      to: receivers, // list of receivers
      subject, // Subject line,
      text: "",
      html: body,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email dispatched Successfully");
  } catch (err) {
    console.log("Email dispatch Unsuccessful");
    console.error(err);
  }
};

//Prepares and dispatches the email depending on the environment
export const sendSubmitNotifactionEmailToSupervisor = async (
  EmployeeID: number,
  Timesheet: TimeEntry[],
  startDate: Date
) => {
  let StartDate = moment.utc(startDate);
  let EndDate = moment(startDate).add(13, "d");
  if (EndDate.isDST()) EndDate.add(1, "h");
  let result = await readEmployeeSupervisor(EmployeeID);

  let supervisorSettings = await readEmployeePreferences(
    result.data.EmployeeID[1]
  );

  let EmailOnSubmit = supervisorSettings.data.find(
    (pref: Preference) => pref.PreferenceCode === "EmailOnSubmit"
  );
  EmailOnSubmit = EmailOnSubmit.EmployeePreferenceID
    ? EmailOnSubmit.Value === "true"
    : true;

  if (EmailOnSubmit) {
    if (process.env.NODE_ENV === "production") {
      await dispatchSubmissionEmail(
        result.data.Email[1],
        "Timesheet submission",
        getSubmissionEmailBody(
          result.data,
          StartDate,
          EndDate,
          getTotalHours(Timesheet)
        )
      );
    } else {
      await dispatchTestMail(
        result.data.Email[1],
        "Timesheet submission",
        getSubmissionEmailBody(
          result.data,
          StartDate,
          EndDate,
          getTotalHours(Timesheet)
        )
      );
    }
  }
};

//The email template. Adapted from src/api/templates/SubmissionEmailTempalte.html
const getSubmissionEmailBody = (
  data: { FirstName: string[]; LastName: string[]; EmployeeID: number[] },
  StartDate: moment.Moment,
  EndDate: moment.Moment,
  totalHours: number
) => {
  return `<html lang="en">

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap" rel="stylesheet">
        <link href="http://fonts.cdnfonts.com/css/nexa-bold" rel="stylesheet">
        <style>
            .linkButton:hover {
                background-color: #677A69;
    
            }
        </style>
    </head>
    
    <body
    style="font-family: 'Barlow', sans-serif;font-size: 1.2rem;background-color: white;min-height: 700px;">
    <table aria-label="email" role="presentation"
    style="background-color: white;border-radius: 5px;border: none;width: 500px;padding: 40px; overflow: hidden;height: 500px;">
        <tbody>
            <tr style="vertical-align: top;">
                <td>
                    <table role="presentation">
                        <tbody>
                            <tr style="height: 100px; ">
                                <td style="width: 170px;">
                                    <img src="${langfordLogo64}" width="150" height="38.527"
                                        alt="Langford" style="padding: 0 10px;" />
                                </td>
                                <td style="padding-bottom: 10px; width: 250px;">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="height: 3px;width: 250px;background: #CA602C;"></td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 20px 20px 0;">
                                Dear ${data.FirstName[1]} ${
    data.LastName[1]
  },<br><br>
        
        ${data.FirstName[0]} ${
    data.LastName[0]
  } has just submitted their timesheet. It is now awaiting your approval under the Supervisor Dashboard.
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 20px 20px 0;">
                                <strong>Period: </strong> ${StartDate.format(
                                  "L"
                                )} to ${EndDate.format("L")}
                                </td>
                            </tr>
                            <tr>
                            <td colspan="2" style="padding: 20px 20px 0;">
                            <strong>Total Hours: </strong> ${totalHours}
                            </td>
                        </tr>

                        <tr>
                        <td colspan="2" style="padding: 40px 20px">

                            <table role="presentation">
                                <tr>
                                    <td class="linkButton"
                                        style="border-radius: 5px; background-color: #253746; text-align: center; padding: 15px 30px; transition: all 0.3s;">

                                        <a href="${
                                          process.env.NODE_ENV === "production"
                                            ? "https://timesheet.langford.ca/app"
                                            : "http://localhost:3030/app"
                                        }/timesheet/${
    data.EmployeeID[0]
  }/manager" class="linkTag"
                                            style="font-family: 'Barlow', sans-serif; background-color: #253746;  letter-spacing: 2px; font-size: 1.3rem; text-align: center; text-decoration: none; ">
                                            <span style="color:white">Go To Timesheet</span>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

        </tbody>


    </table>

</body>

    
    </html>`;
};

const langfordLogo64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB/wAAAINCAMAAAAEH/dDAAAACXBIWXMAAC4jAAAuIwF4pT92AAABI1BMVEX///8kOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUskOEclOUgmOUgmOkgnOkkqPUtAPyRJAAAAW3RSTlMAEBAQEBAQICAgICAgMDAwMDAwQEBAQEBAUFBQUFBQYGBgYGBgcHBwcHBwgICAgICAkJCQkJCQoKCgoKCgsLCwsLCwwMDAwMDA0NDQ0NDQ4ODg4ODg8PDw8PDwn3mydQAARrhJREFUeNrtnX1fU8e6QCPhWsOphCOEWsNRQtVQIfEFjhJqDUdJREOVUCUpJsj3/xQXtLVoednZ88zMM7PX+uvc/q44e2bLmudlZudyAADB8/31E1xmPgAAACLl8vXbD55ubR3+k/2trccPbrINAAAAiIdrtx9v7R9eyP7W43vXmS2ABPz7h5/v3395xG8fz+K3l/+7/5//Y6oAwAPXH2wdjsSbx7e/Z9oAzuRfP/1ytvH/wf9+YsYAwG3Ef29E8f/Fu6e3KQIAnML//fz7xxF5+S+mDQCcmf/xu0MT3jy4xiRCrMwu1Ovtf7BaP2Zx9ojx09X/y8cU/PFvJhwAQjD/nwmAx/gf4mNudfsgAdvrC9/uAP7zx8dU/MakA4B1Lt9+cyjFu8c0AEBMjNd3D5KzPnHyz/70MS3U/QHAMt8/3T8U5Q31f4iG2VHUf0R/TsL9H39n5gHAJtefH8qz/5TwH6Jg4WBkvtj/h48GUPUHAIvq3zq0xBYXAED4zI3u/oP+X4X/303k/zOTDwDBqf9z9p8ZhrAZ76eQ/0H98x/+ycT9H39h9gHACt8/P7TMO/QPQbOexv0HuwKB/8eXzD4AWODy40MHoH8ImImDdEwd/+H/GLmfw34AYIOb+4dueEPtH0JlNaX8F4//8C9m8v/I9AOANPYz/idb/+j8hzDZTSn/T0X/35E/AOji9v6hUx4w5RAgUyndf9A++sP//oj8AUATl58fuuYNt/5CeCyayP8n5A8Amrj27tA9+zT+QXCsm8j/v8gfABRx79AP2B9Co20i/5fIHwDUcPnp4SH2B0jCgYn8f0f+AKDG/W8O/UHdH4Ji3Ej+H5E/ACjBS7n/764/FgBCYtZE/v9C/gCgxf37h165yRJAVuT/A/IHAB3c9Oz+w6esAQTEIvIHgPC5feibLRYBAqJuIv+fkT8A4H7kD9mS/33kDwAKuH6I/AGQPwBkCd+9fp94zDpAQLSRPwDgfrr9Afknlv8vyB8AfHP5nQb377MQkBn5v0T+AOCbNxrcz4d9AfkjfwBwxlMV7n93mZUA5I/8AcANt1W4n4o/IH/kDwCu0NHsd/iclQDkj/wBwA2XdRT890n6A/JH/gDgiMck/QGQPwBkips63M83fQD5I38AcMTlfTr9AZA/AGQKJUn/66wEIH/kDwBuuH5Ipz8A8geATKGj0//we1YCkD/yBwA33KPbDwD5A0CmUNLtd3iNpQDkPyK/sQAAkI4HOty/xUoA8h+VlywAAAQd+N9mKQD5I38AcIOOj/kdvmMlAPkjfwBwFPjrcP/hA5YCkD/yBwA3KKn4c84PkD/yBwBXgf8+5/wAkD8AZAolZ/y52ReQP/IHAFe845wfAPIHgExh5VO++1tvCPwB+SN/AFDKc1nrP39w/cs9fddvPtjaJ/AH5I/8AUAX30se1H98yv281x+/IfAH5I/8AUARcu1+WzfP3GA83ifwB+SP/AFAC1Lf8t06P3S/vcUZf0D+yB8AVCCU9d+/+Fr+61tc7gfIH/kDgAJksv7PLyf5u66/IekPyB/5A4B3RLL+95L+bbdPv1PgzWUWApA/8gcAR0hk/fevjfAX3n6D+wH5I38A8Mk9x+4/4vrTb1r/H+N+QP7IHwDc8dy5+4+4fPuE/59eYxUA+SN/AHDIvgf3f+LazQfH3CTqB+SP/AHAKdeNA3/idgDkDwBB8cDU/beZQwDkDwBBYVryf8oUAiB/AAgLw5L/Oyr2AMgfAMLC9JQ/X+IDQP4AEBg3SfoDIH8AyBZm/X77JP0BkD8AhMaWkfwfMIEAyB8AQmOfwB8A+QNAtiDwB0D+AJAtzO73+54JBED+ABAaN2n1B0D+AJAtHnDGHwD5A0C2eGxyuR/TB4D8ASA8TE76PWb6AJA/AGRL/mT9AZA/AASIySF/Zg8A+QNAtuT/nNkDQP4AkC3532P2AJA/AISHyR0/15g+AOQPANmSP7MHgPwBIFvy32L2AJA/AATIPe72BUD+AJAtHvBFPwDkDwDZ4ml6+d9k9gCQPwAEyBb3+wEgfwDIFvvp5f89sweA/AEgPC5z0g8A+QNAtuCYPwDyB4CM8QD5AyB/AMgWW8gfAPkDQLY4RP4AyB8AMsVN5A+A/AEgWzxF/gDIHwAyxeV95A+A/AEgU9w+RP4AyB8AMsU7I/lfZgIBkD9ATBRKJynG+ZAPjNzP3f4AyB8gCuNXaiutVmd4Gt1Wa6VWKRXiedzv983kf483BgD5+2ByZubG8jFrm8esffrfN2ZmxngPYTSOrH+G8/9Jp1WrRJEKeGPm/sMt3psMMTtbr2+029snlNVub9Trc7MTQYx/YnZ2rn7M0UMcs3r8vxdmZ6eQf0BcmZk/0v3rwTnsbT5bnp/hH+xITE9P31k6ya3p6e8y4P1qI6n2v9oCNELfATw9NCWOz/oVS6Va7Tjj8w0rR/812orPSNpfWG33z5XX9kZ9bkrp6KeONi3t873cbtfrAlsY5G811L+x/Oxc6X/DzubyDdIAF/Hd9NLDF68+nMH7F78e7QLifPJ8eaU1NKDXqpVCffbL5u4PPPQvlo+Mn2Tfd7wPyOgmYHxuNbnS2qtzqpIAU3P19u4oCl5fnEX+Gr0//2hzkIqdtfkrGP50rt56+OJDIl49uRPZDqC80hkK0GtWQ2wDuPbmUICnYTb8H2m/1R0919OslfJZ+u0wVd8eWWO76wsaNgATC6spVby9mvoBkL8FZpY39wZG7KyZZgAmZ+4uL/toKpg+iegPXkro/b95sRTJBqBQbQ4F6a7oiwu/v37vwRE3r5+Wm//+6aEM724Hpv/8kfeNlrqpNdkzMXvEYv0zc8f/h1Eme269n1Zlu6tzXvcsixuph/7XDmZuHPkriPiXNwcybN5NmwC48ej1P5sKNo83AjMzn3sOH21+HuXrR8aNBkeKv7W0tPTiiFMF/PbFi6Wl6auGEf+dkcX/F7/eCr0PoFDtDMXpNcpmgyqVBKXy/eOTJ/i3nt47uQW4fu/NoSDvtrYePN86mwd/8vTLf/nyR988v+eybaBQaXRFFltVtWditr56Tk1798/ettlRWtumVg31ebCxMO5jMszF/8XHiyNvnZC/IGPza3sDSV7fHT1mH1veGenveJY2LXBp6cX7UaLwh7cupfuLfnzy9oMRr+6E638r5jeK/79JQfe+NJvVjvYDqSoKp5fz330277tDXWxdC6rK8wUV1Z7Zensk17UXEvzQ8cVdEX269v/43LrMwP/OYEyNNADkL2f+ZwMLPLsxYtS/M/IOI6X9X40s4fdLo+v/xyfvPwjwKu3Ow2/Ot2LN/H+WhasjFoULjd7F7Wa16kiB5jVtfr+A2w7Wvalotydm/o0Umlm/MHZeF9SnO/+PL2wcWGB7lPgf+Ws2/+eM/fII6f/lFH/BWrp4PJWDR1Pw1Yci5v/Mk9Dq/6XG0AGNEUSdXxkh05xUNKZX98Rmf0vm9+7/qXSeqZ+/oWgL27O/Phus+UfIliB/KW6sDezyLGll/lGqH5+qt+Bhugh8hLLCnbcfZHkbUPifr3aHjuhUko6pY+PnboXm/sN9i4V/m+b/y/9+8v8pfdc/50cutG3Yc3fRbvg/t35gl/7qBPJ3wpXlnYF9NucT7ULS/fC7aZ47ZQferaRB/5MPFkhTePBS6b84uy7a/VfLy7v/OPxPoJnbh+Hx1NKyFx0te6fi4Qhg2sa2MyPx2W1r+lyfsjULE/XdAwe055C/dWaeDRyxc7H+x1K2G246lP+LRD/81osPtniiv/mv1Bq6ppcgHEwxqt7FSeY3AcrfyvcBrTd4fH3Yw3n4n1Y0c44S/mmT59bbHlLmLxaQv1XmdwYOuVD/y2l/skP5f/CR7/9G/7qj/7J79X8u/l+gg0oqyVxk/+9DdL+Fqn9hped4vVvlMOR/atF/wr5F5bP/C9sHLunXx5G/JcaWnar/k/7Pr/2nHs+YQ/lf1HZ3aen9B8toTv5XukNvNM5NBqcbWPeCBPO9IOX/XDzf72O9u5VA5T9e76uw5yiML+weuOaCB0D+qdW/N/DA5uTZQ5pM/VNn1Mjfgfo/6f+Wzreq7FH9F9T+yyl/Zu38J34apPzfhV7mGanZw2/N/5/yn3Wm0f6ilPrdbFdG0z/yD0n9nw7mjYln/Z3K/45/9X86dqDw4J8/CfxtgzODwbSxae/8Z94KUv6H0ay6O/2nVc23tevxDZf23BY5+bfgR/2f9L+A/AOu9X977v+s5vzNIOS/dE6b39sPDnmoLPdf8K/+T7ngM879py5Jn59bfhem/L+PZ8PXq+mW/zf2nXPt0VXjJ5/bPfDJ7hzyF2PGp/o/3ck3KVvy1yH/6Vcf3PL+R0Uv1Qj359imeVrnXyH9jzv3ucN0/+F1oQ1fQ8V+z0ntf1VC/m7D/j+Df7PK/1T7wDftKeQvwpVnA/8sn5b7H4Qs/+9+/eCeX9UE/9XeUA+nxYLl9D8N+avf8HUcfPinLiD/WS/p8/6UQbF//UADq+PI35zlgQp2JkOV/+k1f3fFfo3Bf6kz1MU/ZVBL/8OKyP9UKpo2fM2CVvkvmicP/NnfY7H/4tI/8g8r438i+A9U/qc12k2//eCLh2T8T2UlL9Pvd1HR/01W5V9s6Vpw66X/tPL/0u0/se1NnSkz/xPtAz20J5C/AWOPBor4R+U/VPlfevLBI6983/jn+XhfwsY/A1Wda5WtbMpf44bPcu4/rfw3vKb8Tbr+FvsHmujXkX8MYf/ntv/5KOT/4/sPXvGb+s83h1pZEZJ/C/n/o86jc8O3klco/4PPUfeiX3NOjPy8qsL+PxMYU8g/grD/tDP/Qcr/0q8fvLPksdrfG+qlU7Qv/wcZlL/KOs+55zy9yr+uoW9u5NB/rn+gkDryT8Hk64FCvkr9hyh/32G/365/vRb4sw5c/TJUk03KeVNwL3vyL3YVL7m94D+1/A+mcuPb3oPmEZ929UAnJyv/yD8Z83sDlZxM/b8OTv6XHn7QwSsv9i92htpp/uWCoSX5X8+c/Gu6V7xTVCf/voae+dFS/tsHWjnR9o/8E6X81wZqefRllMHd8Hf11QctvL/q/q2q9Ib66RaRv6T88y31S17VJn8VjFL015ny/9JBOY78k3Pl9UAxz/4q/D8KTP533n/4kF375xvDIPjztn+TH1FE/kH0ePwj3YP8z7ho8IIuf+WPsjuF/BN3+e8NVPP6yudx3g1C/r8q6vTz+KG/AFL+X3X9m/yAEvIPI+VvNfUfuPyTP+i6/odZRP4Jy/0D7ex9bvubCUL+bzV1+n2FS/uXe8NwaOWRv4T8FR/rPD3dg/xHl//4dghPsz6O/BOwNtDP57a/sSDk/+E7hWG/a/tXh0HRLSJ/c/kXOgEteQ35f6u70Fv9vj69MIH8Q271O8kn++8EIf8lZdV+D/ZvDAOjV0L+pvIv9oJacvHCf9jyX0z2kFP9UB6oP4v8L3D/60EgLJskKZzK/+3VFx+04sT++c4wWyD/UM52fFX4zyP/UZv9w3H/8X4G+cfh/sFgzaDjz6n8VTON+5G/DflXwlu2bhH5j5b1D8r9htMRu/yvBOT+Y/tPIn/9J/6KvSHyz5z8V0Jct14R+Y9y0C8z7s+A/Cf3BoOw7L+H/LXbP4PuP7d5LBvyb4S5cL0S8k8e+GfH/fHLPzT3H9l/Dfkrv+k3i+5H/o1gl66C/JMG/hlyf/TyD8/9gwGRv4T9cT/yF5V/I+C1qyD/g4N13J8p+Y/tDLID8j/JE9yP/AXl3wh68SrIvz+e4Hx/ltwfufzHXg+Qf0bl/+EO7kf+YvJvBL56lczLf+7ihxvfPkD+kcg/W+5H/k4O/GXV/dmWfyP45atkXP6rCR4uW+6PW/6bA+SfYfm/v4T7Hcn/Wpjy/z7pqtciP6oZv/y3EyT91w+QfyzyXxsg/yzL/8ML3O9I/rkw5Z901SsxrJ/Mef9Q5T8V+RUGyP8rlgfIP9vyP/4AgSzZu9cP+UfifiH7B2rI+sVPNneA/GOR//wA+Wdd/tJl/yy7P7vyjybb081nVf67Fyf9M3XIL3L5h3jAH/lL81a27N8cIv+I5L+VbMcXT6VH4Cs/Ycr/4ut9MtboH7X8M3XAH/mfyUPJl2pliPzP4F208o8q29PIpvw3aPbLkvw3B8gf+csm/itD5H8WWyHK/0E2DvklXsRY5d+/+Eu+CwfIPxb5Lw+QP/KXTfxnuNH/Ym88D1H+txOsejWyVSxnUP4Xd/tlsOAfrfxnBsgf+csm/vPdIfI/kwchyv/axateim0VTVv+A5R/gm6/7QPkH4n8x/aQP/IXTvw3h8j/bG7H2eyfjy/bY9j0F6D8FzjhnyH5bw6QP/KX/b5fdYj8zyHEK/6eX7zqrQjXsZEx+W9f+EyzB8g/FvnfHSB/5C/7hZ/iEPmfO0H7MZb849zxVbIl/wuP+Y3vIv9Y5H9lD/kjf9k7/jNf8L9Q/k+Dc//+5Yzu+HqFLMm/TdI/Q/LPaNIf+Vvs+VvB/RfIP7zv+l140C/a+xw7WZL/hYH/1AHyj0X+rpL+O5vPlpeXZ74wv7z8aHMT+WvkO8N3ynXPd7f1hV4g8g/upP+7y0p2fB4Wu5Yd+V8c+G8j/1jk7yDpv/Ns+cbk2ccM55c395B/gm/uHfEqiM/7OUv691or1dK3Z7HypXKt2VEv/9Ba/q753vEdLXbN12IXMyP/CwP/RXeubbfrX1htt7eRvzDP7Ap2c/nGWJItyPzaDvI/tQD/4uHS9PTJKvyl6emlhy/eKz7u5yQE7KxUzq3FlqrNnmb5h3Xab//ibr+u1cUun7fY+VLN7jmDTlbkf2HgP+7gep/2en126tS/fHah3u4j/wCu99lZSyT+vzcAz5D/1wH40o9nJ+C/+/HhK52hv/2kf69ZSdSEVax19Mo/dzucjv83F9/vU7O22I1KoqP25ZWux8VUJf/d9mf68oG/5Tv9d9cXpy4awsTc6jbyF8BavL3zaDLFcG48Q/5/XrP78MeLR3Pp1pP3+kJ/28JtjHLlaqHa0Sr/3PeBtPy/S3Cvb9GW+UdZ7KI9/xdDkH+/XV/8Jmaena2vt+UCf6vdfhuLE0mndXxhvY/8zbB1p//ajbQjGpt/jfzfPryaeEQ/WvG/Qehfs5uArYx841phpadT/kf6v6e+7+/d05tJJtlK2r01+hH7sqWbJVva5b+9One2OqcWN/oigX/bnvkXxkec2jnX/o9L/nbu9d1ZHjMa1eRatuX/ZMSw+9KtF4pC/4JN0zZK6QZV6eqU/6fOv+sPHjzfOkJbmX9r6/GD65cTTrCNoD/d+XpLe72KZvlvLFwcM0/Vt40Df1t3+22PbP7PLLSRf1psWHZnXmBTsryXVfm/X0pzzu7qEzWhv8U7/RsGt62UWlrlfybXbz5+Ixa/P755/TjTcP36vQffcPP6KXg/39Grpb9TP1+zoP9eXqv8k8fME4u7ZoG/nbv91qfS/yOZWO0j/zRc0al+V/pXKP/3S2lv1/tOWv9XU0pWpfp96L8m8e9Api1g/7bl3yQ1Req3pf8VlfLfXRwtZp5aNwj8F2z0KdTHzd698fou8h+dZ1rV/1n/mZN/evVb0P+TdKOwlV9vFcxfKbfJ/5rMv4Nr78x79S9b/kUiXepp5I2HlJdvPSnqk//GrKQsPQT+xur/vCnpI/8RkT7mt7csnJh4li35PzG9U39a9Oxfqmv+LH3apVsSeaOs5IMtyz932dT++9/b/k3SkN3nFWV2JNKZnpY2+a9PpJXlro7AX0b9nzY0feQ/EsJ36z4bk9+e7GRH/m+nBSbsjmDn/1Iau9qRay0v9UYVWsHJ3/guwHu2f5EURDP+VbFxlYXfxpIm+ZuJ8zT9Ow/8U29eTtP/OvL3FvjvzNgYo9Xcvyr5L8lM2HdyA3yf4q+3crdfpyj5SlV7ocnf8AuA+7aT/qLH/CTKO3/vRWXfx44i+RuL8x/6dx34787KvoWz28jfT8V/bczSKCd3siD/t1fFJuyO2KBu+Q0BzRqt/Af/cvI3C/2f2v5FItnjWRUem2zwX9Ei/7ZAzPxtqvxCF8vKtS7/ItaRf9KKumS1/4a9cY6txS9/42r/Sa6+9XbaryGv0F5Z/pWqBSb/nFHV33anv2Dg3y2KDy4vudXr6hDS7pzM3ExseDvjvz1l402c2kb+iRB06usrVkc6vxe5/O/IztelF55a/iwE/p2CjTeq3AtL/kZ5/2uWf5HIBf6tvI3x1byG/hbkvzouNjezu34u91sft/QyriJ/t4H/mu2xWkr9K5H/+2nxCRM69PfQe+DfyNt5owqdoOT/wET+tv91it3q1LA0QMGtXte//PuipfLxetLAf0LwERbsvY1zfeR/IXKddPP2Bzv2Ol75v7pqYcJkCv9vfQf+NWtvVL4VkvyvK5Z/wV9UnZRi11/oLy3/tnTM/Geq3OHn/HanbL6PE9vI/yKkUul7M06Guxar/F9dsjJft0QG9+NIf6d44F+x+UY1MiL/fcv/MhsBLHa+4y30F5a/hTa58dUkgf+4WES9PW73hbR36C8W+c9LuX/S0YDX4pS/JfcL2X+kW/6kA/9eJQxrKZf/VhCBf69odZR5sdpEyaf8LeXLZ/sXB/6LYuV++65YRf7nIpRH35l0NuK1GOVvzf0y9n/vUaaWdZCzdhuhBflf0yv/WiCLLfV2tjzKv28rXz6+euH/y2447rfzDYJ45D8p1OY/5nDMa/HJ36L7c7mHbvP+hdDcb+U7tJYaFkwu9rc7h71QFlvK/iMeP6kH4P4knQFSJxXcDHcB+dsWqVP3y9vfu/ytul+k53+EvL/w5X4lF29ULQPyPwxg/1R2sdhC9h/xTEI9CvdLtfstuBrvAvI/k72g6v2W7O9b/pbdn8u9cpj3F77Vv+LmjWogfzNamVvs3minT+tRuF+o3a/ubsQLyP8M5oN0v7T9Pcv//VXb03Xpvbu8fzVE91u1fxbkL1LrqbpabJme/9GGKyZ/n+4XUul6eEOOUP4i1/q7d7/weX/P8p+2P1/T7vL+XUlvNty9Uh3kb8BKUIstc+JvtNN+UvJf8CqMjeDcb8P+Uchf5Ha/eR8jH9uJRv53XMzXkqt7fiQ/7pLuw+lphdBF/ukRqPV0XC62SG1qpO5EIfmvehXGuMj5ftejXkf+p3BXwJyP/Ax9ci8S+f/qZr6My/4JaxNNQWt28y7fqGJPv/wvK5V/WaCEXghusUdKVcjIf9uvMCSC6N1x58PeQP7/RCB5vulr7PNxyP/tJTfTddVNgkLynJ+Lc18nqeiXv9brfQW2fKXwFrvnXP79Cb/CELCoj37F8W3kbyHrvzfmbfRrUcj/qqvpMk38J/uur+SZuarrN6qB/FNm0c0nacX1Ykt0KYzSjioi/zm/whgPtWdhqo/85bP+M/5GL1f29yj/JWfTdemt4VAT/S2ChfOm8zcq30H+nsLojvvfHx23r2hdRjqhZ/3X/Yx8Dvl/w2aoBf/PzIQv/1cOp+uWg0MJgu1+vbz7N6qI/D1l/YvuF7sgUPYf4R2th5/0F8j6eyj4f2YV+X8dOpvf7Of3AR4FL/9pl9P1wn6SQjBxXvbxRtWQv5esf83HYled5v0F5F/PecY8eT7rbezbyP8k5i1zk34fQCrx703+D51O17T9on8v4KS/VC44e/I3zvp3/Sx2y+VbWg83apbLnXs8qDiF/E+yFnTSXzDx70v+7y+5na4Xtov+5aCT/rYS/9HL3zjrX/Kz2AKJ/+SvaT3MVjnR1LnX7Usd+Z9gL9xO/794FrT87zierR9tH0yQy/pXfb1RK8h/ZHphZnkkEv9ld+7Z9f7bdjvcpP8xu8j/C8Zf8533/jbKXFHoS/5vnU/XW8t7FbGsf8fbG5XvIf8RMc73FLyttnHiP/k9P/XgA/8J0yfY8Dv+WeT/heVQr/eRfAif8r/lfLbMGv6fWLeA7zywTDRosXXRSP7XlCZLVvwttnGVJ/k9P6by7/uu+Jsf9PN9WGEd+f/FpgdlijO2F6z83Qf+hl/3u/BcoljWv+XzlRK/419wJ2Mk/+uWJsywSdJXe4fMK5v4jGI93F45IXd6P6ww0Uf+fxJD4C8T+vuR/y0Ps/XEasefmDYLPt+oCvIfiYKeqkiKwfdcjb4eeNhsXDP3n7oQ6/kLXv4zMQT+MqG/F/m/9TFbZqf9pi3nUN1/2/VUWsjf4WbJa+BvfrNDy5F42t5/006EHvjncuN95C8RMisJ/EVCfy/yX/IyW28tdvxVowj8JVsXMiF/w8z5it/FNm7wdCR/7+1+pqf8FQT+YqF/8PJ/FkXgL3FPoR/5X/IyWw8t3kkkFTE3fb9SXeTvbrY87/SMQ/+SG+/4V+dq8IG/WOgfvPz34gj8Jb7u50P+T/xMllHe/4I7/iJo9RdJZGdL/oWgSzzmoX/Sor+Z/Df8/55thx/4S4X+ocv/SvBn/IWexJP8f/Q0Wyb9/u/P/clSH/Xp+H+lusjfVZHE+07PNPRvOdGO/6x/Lsiv+dkJ/UOXv9nF/js5RWwGKP+3vibrV2vt/lIfxankQvdBpuRvdsq/63+xTU8rOJG//15/w7vxJ5TIYhX5m34Rb1mT/OcDlP9DX5N1y1q7v1DJv6fgjcoj/8SYLXtVwWobdiwmPOlvJP9t/7O0YKpLHUwgf9Nw+Yom+Ruf9vMg/6u+Jus7a1cTCKlyRcMr1UT+SXH1YRx7lJxkqozk7/+GH8OQeUGNLdrIPxdLu98xa8HJ/72/yXpv6XiiVMm/qOGNKiP/hJhd7tBU8fuj42K3aiT/ucCl2dcjiwXkfyWWdr9jbgQn/yf+Jsuk6P/rOT9X6JR/R8cr1UP+yai4iJotY/bqJuz4qwdeMe9H0O5n/iBRyN/sfr+xnC72QpP/LX9ztWTprJ/Qxf5VHW/UCvJPRi34rL9xi4d9+fv/mm9u3MiWU4pksZ55+Rvdi/dMmftN8/7u5X/J31xNW6pWdGRMWdDxRhWRfzJa4Wf9TVs8khWqTOS/4X+KjL6Hu6tJFlOZl/9aRFl/47y/c/m/8jhX31k66xdV1l/0qH/U8u+Fn/U3rV0k+2SzifwV3I63GHi/4gl2sy7/zWh6/Y8ZC0z+T3xOlp1DCkL9fjUtr1QD+ScihjSPYd4/2TtbD7vfL/R+RdG8f+DyN3Hl65w6NsOS/x2fc/XCykF/oStxi1reqDLyT0IpijSPWd4/WfGiHnbJ3KjZX5cs5jIuf6NQ+ZE++S+HJf9pn3P1xMquReZSvJ6aNyqP/K0nzFfUrLZRv3+ydv962PLcDrtl4SsyLn+jZv8b+uQ/E5b8vc7VkpWD/jL3+zX1vFIt5J+Amv1iuQvMrvi1LX8F9/sZCXNRmS3a2Zb/jZgO+pmWMZzL/63XqbplpVlBptm/queNqiF/2/nyvJ7V7lp/jrqRa3xjdNJvSpksFrMt/+W4Sv6GRX/X8n/hdaqmrYw8spK/3I2Fccu/FUXJ37C/M9EC14Nuljc56dfXJovZbMvf5LM+axrl/ygk+T/0OlVW5F+IrOQvtp2JXP4mJ/0aiha7oln+Ck76zR4EnbgQrGH8eWFhwPI3CZTvapT/fEjyX/I7VzZu+ZGJk1uaXqkO8re7Q6ooWmyjzWuis371oGvmgd9S8A2mRf96ZuU/k1PIZEjyv+N3rmy0KsqcjKtpeqUayN+uM0uaVrunWP6zYct/Tp0tVjMtf5PL8HMqCUn+036nyob8ZdrjypreqCryvxCjhI+q3x8mzQuJzqiELX8TXU6ok8VCpuVvYModnfJ/jfx9Dl1G/kVNb1QJ+Vudo66q3x8129WqetD2NEmU65PFLPJPx6ZO+W8if59Db4poUtUblUf+/pXpjIpi+SuYnnZM/X7GHX9By9+kQq7wfr9jlpG/z6GLXInT0fVK9ZC/TfmravAwymEkOqSSWfmvK7TFboblb3Ih3jLyz7D879iUv65YUOyOP+Sv/UKnY2xnrMKWfz+mZn/jdv/Myl/h5b6mj+Ra/t+FK/+zTimKnIvTFQsKlTKiln9Tx7Qgf8V58gWFtlhH/vGc9AtL/p6n6lcL8h9GKP8a8reZHFEm/5Za+e+GLf9ZhbaoZ1j+JjnySZ3yv4L8k7KkVf5lXa+UlPwF9zQxyV/ZLxDb+5h60B1zEd3sf8wi8o/omL/RAQbkn5hfbcpfWSxYQv4Zkv8K8rcjf42ymEX+yB/5C13uj/yRf9jyryH/sxlH/sgf+SN/e/JX9kYh/wuJ52gH8rclS+Qfjfx3tMr/NfJH/qIUkH+G5F9F/lZk2VZpC+Qf0QV/Rlf8IX/kb+2hkH8Y8i8hf+SP/JE/8h/1m77IH/kjf+SP/JE/8o9U/h+QP/JH/sgf+SN/5I/8kT/yR/7IH/kjf+SP/JE/8kf+yB/5I3/kj/yRP/JH/sgf+SN/5I/8kT/yR/7IH/kHIn+1l/wgf+SP/JF/WsrI34oskT/ytw43/PmUfxf5I39u+EP+Ych/Avkjf+Q/KldP/5mtCOXP9b7IX4P8+0HLf1ejLLjeNx1jyD/L8p+2KP888rcp/2vIP0j5a7gdn7v9kX9KUzpgDPkHL/9Iv+pXViJ/C1NksOwdZb9AGpZTVsgf+auQ/3x88p9B/j7lX4tQ/mUh+Qs+VkTy11bkaSH/c9hNP/pxhbaoZ1j+Jqa8i/yRvx35l3W9UjXkj/yR/yfa6Uc/i/yjkf+yTvnfRf4+5V9RVhxH/urlr6zDY4j8syP/df/y/yVE+T/TKf9l5O9T/iL18RVdr1RTSP6CQ9Im/2Y8RR6DJ0nUvpBZ+dcV2qLtX/73fT37FQNTKr3ibxP5+5R/UcKSyhrAW8jfZnJEV5GnZPu9DVv+BqNfVWiLfoblb3IuTulB/9fI36f8RS7EUdYA3pNxfxf5B1DkKSN/S6PXeMvPAfJPxxWV8h8gf6/yj++Kv7xQ4C+Zz4hJ/rqKPNafJGz5L6YffV+fLGYVyP+nzMTJ1plE/n7lL5IjL8aSCD5JM2L5l6Ip8jRt5zDClr+JLvWd9VtQIP8fvD39Zmzt/vMByf9FjPJfie6sX1XfBX9Ryb+n6heISeaqivzDavevZ1r+z2Lr+HvkuosB+culTXWWgVeE5F+JWP6FWG5zNqrxlCwLR8MEmalSGW0F8v+Xt6c3ORi3p1H+m8jfr/xL2srjxkg1+0seadMm/5yWifFa40lUrcqu/DfU2eJAgfz9Pb2J/AeTCuU/QP5+5V8QEaWmV0rI/aIBrjr59yLJ89Ssv7WBy78dUcffVLblb3LLz2Ben/tnkL9n+cscjFPU8VcUcr9oaVud/E3SI01Fv0Ba1lc4cPlvGLhySpktFhXI/zd/j2/UHK/wjr9l5O9b/iJZ8qqeV0qq30+0lKFO/k0t2yKPaZ5kKxy4/E165BaV2WJDgfxfenz+QVxF/03k71v+Ih1/ioJBqct9RY+zq5O/0aoX1Cy2Ucm/kQX5L0RU9O9nXP57cRX9B8jft/zL6nLkZgjd7yfa7K9P/hU1U2OE0cmOZL0Lgcvf6F4cXbIwLvlLyP++xwkwCpUfaXP/DeTvXf4yHX9qOsClSv6ybQzq5F+KI8/TsX87ReDyHzeR5ZwqW9SzLn+jc/E72uS/hvxdyf87u6Gymjtfpb7nK3uAQZ38c1HkeQoOtneBy98oV76uyhbbGuT/s8cJuGtkS23X++8hf1fyP/vHihTJu1peqY6Q+2WvLtAn/24MeZ6qg+1d6PI3uRhH1WG/iQMN8v/B4wyYnY1Tlvc3zPojfxH5V/VlyX3FgtYOs+uTfyuGPI/RTi/htyhDl389lrz/YublPzaIKO+/hvwVyF+mSq7EB1IH/YSDW33yr0WQ5zHb6SVr9g9e/kYfw9mIKusvIf9/h5sp1/Vlvz3kr0D+MkV/JT7oqCz5K5R/OYI8j1l/R8K7KUKXv1mPvJ4v+wlk/SXk73UOzE7Gr2ly//wA+WuQv8zJeBVf9hPL+gt/rUCf/IsR5Hm6LnI7ocvf7EJ8Pff8rCJ/wzvxBmOK5L+J/FXIXyZV3tDwSkl90U/6ykJ98jf7BIKKfv+Sk9xO8PI3+hTerhpb9JG/aZPcXT3uvzJA/irkL3Q0XsOXXqVu+JHOayuUfyv4PE/D6AkS9vuFL3+z4/FaWv4WDlTI/6XXSTBU5o4e+a8hfx3yN0yfKvrYW0XK/dIdDArlX9NUFvFQ4kmaqdoIXf5zRr5sK7FFG/kfsWMmzHkt7h/bQ/6jccuW/BsiwlSQCm5JyV+6pq1Q/obXOvu/39+wxFOxbx0dv2jHzYQ5q+IhZg+Q/xHPIgn9lwfIfzSmbcm/LGNM71e+l6TcL57VVij/fOAtHvmem91L8PLP7UYQ+reR/zF3DY2p5LSfQOCP/IXkn9OZKx8ZqQ/6yScxFMrf8FRkz3eLR83Ryxq+/NfDD/0nDpTI/79+52HS0Jivown8Xcv/Q8Dyf+HCmp5Df7FzfvIn2TTK3zBt7rnFwzTwT5y5CF/+hr1yGkL/thb53/c8EaYh83wsgT/yl5J/JYrQvyEmf/E7bDTK37DY4zn0r7naqIYvf9Ow2X/Dv0zFPwb5Gxb9dVT9JQJ/5C8l/7yQNKs+p0eu4i+/idEof9NF9xr6F0wPdSZuWAxf/qYX4/o/699G/n9iWvTXcNZfJPBH/mL9CkJ5f6/RoFirv4U9jEb5m16F3PPZ8G+a5em4EI8W+a+aO9MrcwfI/09Mi/6DPf/X/K0NkL8m+Ve0Fst9BP4WjrGplL9p5rwR8GInf1EjkL+pPPsTXoc/vov8v2AcNXu/4X9mgPxVyT+vtlqemK6Y+5vyg1Mp/2K4i238/abkH22MQP45U2n67fmrHyB/wbDZ93G/18hfl/zFTsl1fE1OTS7wL8mPTqX8jS9D9rbYxl+jGOEsZwzy3zC1ps/v+0wdIP+/Mf4a3mDHb+J/eYD8lcm/LGVOT21gRTn32zizoFP+xscjPDV4Gnf7jVKxiEH+xhfj+0z8byP/E4yZa/ORz/Ff2UP+ruX/q+0o0HMuWK7bz8ptBTrlb7zj89TzZ77YI9zgGIP8ze/I2Y4g6S8h/1+8r+XmIOjEv1DSH/mPwNJFP1zsY7hecsE13YG/Uvmb7/haYS72KDc4xiB/geh51dPIZw9Uyf+l96W8a+5Njx3/Ukl/5C8pf7m8uYeOf8Gkv526hVL5m1+LVA1ysUc5pxCF/BfNxennqp/xPvL/Jm8uIM5NX4OfGSB/hfI3b6D29633vFynv6WrCpTKvxxglUdisUd5Q6OQv8Dd+P0pHwNvH+iS/x/+11Iicb7sZ+hje8hfpfwrcv50LYSm9sBfq/wFOj26ru91Euju6DnSjx75S3TNbY+7H/bqgTL5f/S/lHcl1HnDy9A3B8hfpfzzYi1/w45bIQgW/G3dUahV/gKfQ3Bc9pfoTRnpdqI45C+Q9/fQ9LdwoE7+/44i7z/Ym/Qw8rUB8tcpf7mWP8dNfxVB99uqYWuVf9G1SlUs9kiZqTjkPy7hznXHg5490Cf/n+LI+/s47T8/QP5a5V8QdKhDIRR7guO29V1CrfIXuRfRYdNf2f0ixyF/83t+3Nt/qq9Q/v/1v5QyEn09FuSwkb8V+YuWzp3ZX9T91noV1cq/KjFrlbAWe7TNSiTyl/k4jkv7y7tfQv6/+V/KsUGI9p/cQ/6e5H8rwc8vDcOzv6z7rdWv1cpf5qMOlaAWe7S2jkjkn+sHZn8L7peQ/8d/+V9Kodr5s5Ddj/yTM+0qB+zW/rLut3duTa38JVr+XNlfaLFHfDFjkb9Q47wr+9twv4j8f/a/lDeE/OnwA3/i7kf+wvIXbZ1zYX9h99u7nkiv/IXSPZVwFnvEHV4s8p8QEui6kxN/VtwvIn8Fef/cziCwzL+8+5G/sPxlQ3/79hd2v8Uj63rlL3W5k3X7V3p+SjuxyF/svhwX5/0XrLhfRP4ff/C/lGKX5DqyvwX3I39p+cuG/rbP+1dk3W/jU74ByL+iPm0i+2pW3DlTl/znpBS6O2V7qIsHB3rl7/+GX6mWv2P7X3Ew3PnBAPmrl39eWKcdm3f9VWXHOmxaHKti+Yule5o2t3oNsfSOw4BZl/xzu1IO7S9YHef4+oFm+X/8j/+llLsux8FtP3cHyD8A+Ytelvfpwjxr9/znm8JDtXpPrWb5V/Rv9fJyX2weuTwRj/wF42mb3/ib2j7QLf8//s/7Ugp+IGcwH8xGBflblb906G8tG1zsSA+0ZHPpNMtfbs1tbfVKcm/l6Nc3xyN/yS/kbVtL/Vsq9wvK/+Nv/u0veUu+1ab/K68HyD8M+YuH/pbiweowkE1KAPKXXPNGXvf4Uny3KR755+qSIl20s0HZODhQL38F9hcto1ss/N/YGyD/UOQvH/pb+FBeoSW/RbG7dKrlL7nmXfEEimiOJ8V3myKS/7ioSW0E/3P9gxDkr8D+O5Ii3btrZ5BjjwYD5B+M/C3E1OLBf01+g9IrZFj+suke2b6/fM33PjQi+eeEO+lWhQ/9TbQPDsKQ/8c/fHf9CXfQb9oI/mdeD5C/Avkn/1u6FuwvmQ4u2RhgOZdl+cume3qCmZ6y7GKnaeqMSf4TwjIVbfsfrx8cBCP/jx9fjnbe//9+OAWT/MGOrEvlg3+bYT/ytzP0ig35HxlBRv/Flo3RreQyLX/pdE9X6MafkvRipxlXTPLPiR+i210QU3//ICj5H+n/pwvl/a8f/nP//suXv537c35/+fJ/9+//Z8TLg8QPz7+eka327wyQf2jyz1nRq4z+Cw0rQ2vmMi5/8XSPhP7lFzvVB5ujkv+EvFBF9O9E/dLyP/b//VOj939/dv4fo3YS/PLTCJ8Nkpfrmlzuf2ZzMED+4cm/NBzq1H/J0rbE8kWEIci/LD6ppvovNeUXupx5+edspNZ3Fwxr/xNu1G9B/p/K/y9f3v/C/y4K8y9OJ3gL/Y/1L3Pd75W1wQD5hyj/XGNoTf+N1K1/+UrH1qAKuczL30a6p7eSfmIrNvZ56T7YHJf8x61otr86kX5IcxsHrrAif2l+T5r/t5FX3xOI/l2oH/lbGrqN435/h9mVNHF2qWFtTL1iDvnnilbmtpVqsYsrdha7iPzthP6fDv4tpgr/p1Z3Dw6Q/9f811/ofxz9m134az/hj/xtDr06tEpzRCWUV7oWR+PkU/Tq5Z9bsbbYhRHNb2uxU3Z1Rib/cXuy3Vic0Gz+cOT/8Zdk82dLs6/n02b/x+7uDAbIP2T55zpDy3RqCS+DKVabPasjceL+AORvMd3TWSkl2+3lyw1727xeHvkfs2DTrturcwkTABMLG/0D14Qi/48/JwuyrZl1b+1GilfrxtrAHcjf0tCLQwe0VsrnJmILpZpl8TtzfwDyt3TE8+8NQOX87V6x0rC75Ux7lUNs8s/Zvklne31x9nzvz9U9iD8o+f+RrOv/mUW5juj/sRtre4MB8g9f/hau+D9rB9CsVUtfB4b5Uqlaa7Sc/PW1HPL/C/sz3m2t1Mql0jdbvKPVbllPNaU/zhmd/KdcaHa3vVqfm/16EzAxO7tY32gf+CMY+SdM/F+x7NvNu8nO/s8sbw5ckzH533I49M7QOZ1Wq+v4r2zkkP/fGu65nPpWq+XyHUt/pCM6+edWHSt3u+1T+GHK/2Oy0H/ZvmQ3H82f1wE4Of/IvfgzKP8lh0MvDjOAM/cHIX/bfZ5eqeaQv4OeP+UEJP9kVf+co/6615uPludnZv4+BnhlZmZ++dHmzsAbyN/e0Gvxu7+aQ/6OE/++MLjDMT755+aQv3p+S7aUM4OsgvwtDr0Vu/srOeTvM/HvMumfR/4n2ciu/P8IRP4fE370Zw35I3/xoUdrAg/uD0T+Fm751YHJRxtjlP94P7PyD8X9HxPe8ze2h/yRv/jQyzGrv1fOIf9/0ohysY0+2hij/LOa+A9J/vcTLuUN5I/85Ye+ErH7iznkfwr5ToSL3ckh/29ZR/5x3PKX2cQ/8rc79GjL/p1CDvmfSjG+Yo/hh5vilH82O/5Dkv/LpEs5toP8kb/40PPdON3fzOeQ/xlUolttwwJPnPJ3c9UP8je45C/xUk4if+QvP/RilE1/K+6XLhz5R1fsMb3EMVL55xaRv26SL+Uy8kf+8kOPsOmvV8kh/+wUe5o55H86G8g/EvnnNpE/8pcfenRZ4E4xh/yz0/TXySP/s8r+28g/grN+WS37I3/7Q4/s8Jf7cn9w8o+p2NMz7+yMVv65qT7yj0P+WSz7I38HQ4/J/l5S/sHJPx77S5zojFf+2TvtH638c/PIH/lbGHo8NWA/Kf9jHgQl/2iKPRI3OUUs/8w1/cUr/9wj5I/85YceTQ14xd/SBSb/SOwvkueJWf5Zu+snKPn/PNpSPkP+yP90rmbe/t1SDvlnyv4yNZ6o5Z+xlv+g5H9/tJUce438kf+pTOcybv+VfA75j0D4x/1rOeR/Idlq+Y9Z/llr+Uf+buQfvv29hv1Byj/4Rs9GDvlj/wzJPze5h/yRv7j8c/lm2EFgPof8s2V/KfcbyL+dw/7I3538s2V/5O9K/kGroFX0/hs2RPkHnfmXa+6MXf5Zsn/k8s+U/ZG/O/kHa39vZ/uDl3/AXX+Cax69/DNk/9jlnyX7Z0z+D73KP1AV9Mo55J81+0vu9+KXf3bsH738M2T/jMn/hV/558phXvzWKiH/1PbvZT7XkwH5Z8b+8cs/O/ZH/k7lnyt2h+g/U/IP8abfnmyLRxbkH5L9+33kH4n99wKS/6uA5X9JZATBNv23OOqXkkJopzyl73DOhPzDuetve2IB+Z/LlVBu+1kbWwtH/i8Clr/UGGqhtoA1C6HKf9/vWxfYhq8lfaozI/LPrQbh/tWjkW4j/3MJ5K6/u0dD3UT+IVUsSsF+8c3nHX8m8t/yrYWQjvw1xJ8+K/LPLQSQ8p8zG2g25J8ziqgdsTP5qUaB/INqVwj3vp9eFfmnIphOTxvHOjMj/9xUX7n72+OfGxSQ/0Wo/8bfs7HPA32G/EOSfy5XDTb475SQf6q2vzAK/10btzmll/9GYPLPTahu++svGi9JPfdDNuSfm9fd6XfXfJyODfor8v+zCawV7q2veeSfJt0TQuq/aWVt2yZxZmCMK2772576Msw68r8QzU3/ryf/rlCEIv+lcOX/Xngo4Qb/fi79MZH/AxVeUJ/6t1XUyZL8c7kFpan/fl2iOyFD8lfc9rd8cpg7yD+4ikUh3C/9tArIP03wrzvd07H1AYdsyT83pTL13544OcZZ5B9u4X9n5qtBbgYi/zvI/2Qo2A02+K8EJf/bWrygOd1Ts/bU6eW/kAsSfWf++t/MJPJPxg2Fqf9HY7kg5T8drvyf2BhPLdjcfzMfkPyvq9GC2l6PjsXvNqaX/2yY8s/N7upy//r4tyNE/slQd9/PiWq/aXoC+futWBSC/c5vrxSO/C8r8oLKyn+vZvORsyf/3Lim4L99yjQi/6Qsq2ryXxYcoGOD5sKV/62sxYIe88TC8t9X5QWFbf+WezjSyz8XLmqC/91TayfIPzGTeoL/Z1dynuX/PrVA3wYsf3tJi1Ko+m/lw5D/ljIvFHUteNf26Y3U8u8HLP/ceF1Fsb8+npOVfy5r8lcT/H/T6OdF/uHe8aM1aRGq/ntFd0t3O/hm/xNUuooy/ta3cKnl384FzVRbYbEf+Qca/J+W8TeT/2SKmXgb7Ek/A/lb/h5hqLV/d13/19PL/5pCMWhp9XRxZVNqB67mAmfOb+5/feLMkRksyR/ByP8HuZW867vt/9sefwH5zzg1qO9+v9xDvfuWwkqQnf8rrpbucmr3v1PphbwG/TecXNiQWv5zueCp9zWqP73827ncyyzKP3fF66d+1q5YKEo4lf977/8Ul1LL/6oDHVQ6Adrf2W2/7+LJ+ivRf8vRgY2NtKYZD1/+3kr/56rfSP7/DUb+sis5s+lL/ZszVjoSbqSYhF9VHZUfiWnl3QrFRnjhf8eR/Z+m7fW/rFYMXvXfdHZWM63+tnNRMOH+uv/+Beo3kv9/QnH/b9IrOb+jT/0GX/ZZdhk+T/v/h5h26D8680Glhf1Fi/4PNIsh76v1r+Hwhua0F8kv5HKx6N9p8n+3fnHKxKQHM5Si/3/lV9J96X/zwuT8pEv5/xhqr/8RTwIYeqEaWPq/40Yk76I45/cPyu53e72a048zTKUMX8dz0TDurvbfTrRn6hvI/5dA5P9vCws5trynpdb/hbQjmk8zAe+DDfxT5v3fX3I8zMD87+bIX6rQ/81l/WZw3OvZcf5hhnQ97/VcTIwv7DrJ908lG86Ggfz/FUbo/9LOQo4tu0r+7y1fSTSiNYcNfynz/ksq/g2maVh4f9XDQPOVZg/7f8Xj0d3//HIYaqi4+sRjr1F0/3T1DFf8TzC7oSLo/8Ri2j7C4z/8Uwju/+Nf1hbSSe3/9fxY0u1IutB/L9WzX3obZLff57G/Gj3n/52vwZZWQkkAuKn7j9rz9+5mOGZwkuxpVrw823iKj9z2p3LxMbFoL/zfXZwYZUn6Jn0YIdj/J5sLOfPMctC/NsoNPJN7rkr+R1wdPfH/UMu/v1Ht//aW1+Hmy2FsANzY/+b+CF3+T28GpgbL/u9UC76ebKqP+/+ailUb1f/d1SnrS3IyHfPD78rV//u/La/jlUd7CoL+vwaTIvP/KO2Tfzdi9vzVtKJ/fkvJty7vn/yoYcSlmv4SgBv7X773JlGX3/MH14NUQ6Fqqf2v6c/8nwLNES/6aU/k4mVOuPl/ezHNTmliffQsxPbff9FP/1Os/v/95GIdb1gJ/3cSVvq/Sf3fWN5Mdgfx683NR8vLM1cMHvy7h8kj6F9/1PWP79KtBHuXVy+Wbl3VpIVyrdXVbP+mo4m4fPPB862tLymArb95/uCIm9evh62GfLnRla7zV/LeH2tqBNe0Z3ORM7W6LdXht5D+UMT4bH29nWQjst1ub9Tr9W+W5Yef7v/35Rd+uf8tP/9gh/v/5OQwfv7h/1wt49i88KX/O48mjQY0M3N3efnR5rc8Wz7ixszMjNyjT08vHfHimLOC6Re/Lk2r/Nd3dfrO0uncmp6evqr1l0apqncLsJIDqZ1eRWoD0GtWi1qeamK2Xl9tH3FuAntjcSITazyxYJoA6G+kCvn/wezswpHZN9pfsX70n+oLs7OzE/xzPDfjflcs/n9990rAEzH9Nd/xatiheLQHaLbUVQIqrIzoBmDFsATQVST+U3YCs5+lc4LF2dlsrfHRBiBlBmB7XUb8IBH/rxnX/3fWRq3zQ7bJl452AUfbgJaSnsAiSyK9zavUUm3yOs1aKc/0hcBx7n2kHUB7fXF2nHnTxeTdZ3sG4r/CDIIJpWOONgO12krrCA/VgS6+sbOylcSJnl6rUSuzCQuOqdn6avuCPUC7XV8kC694AzC/NmoLwN7m8g0ifrASOH7aDbRasTX9ZZNCqVT7lOj5diPQOfpPK7VauYT1Q2d2dva4ALL+d/H9z9o70g9lB5Cs7X5v89HyDN4HF8FjudZ0UByoMtMAkHGuzMx/aro//aDdXcm2e4BkW4Bqo0vZHwDAWTJg5phJJgJ8U6g0LJ4T6DDBAAAAGimuWEsA1JhdAAAArf63FP8XmFsAAACtVKycAmgxsQAAAIrD/4YF+5eZVwAAAMUU5PXfZVYBAAAypn96/gAAALTrX7j23+OWXwAAAO2UuoT+AAAA2SJfI/QHAADIGMUOoT8AAEDGgv8VwdCf6QQAAAiBitydfxVmEwAAIASKXb7vAwAAkC3yYoX/EpMJAAAQhv2lbvxpMJcAAACB0OC0HwAAAPan5Q8AAAD7X0iTiQQAAAgFoa4/8v4AAADh2L9L3h8AACBbFHvk/QEAALJFhSt+AQAAMkaTe34AAACyRb7Hp/0AAACyRdlc/i1mEQAAICRa5vZnEgEAAEKiYC7/IrMIAAAQEuYX/VWZRAAAgGyF/nzZDwAAIGOhPx1/AAAAYVGk4w8AACBjGH/gp8AcAgAABEWVO/4AAACSkS+VSuXambQ+06hqD4wLtPsDAABcRKnWaI1wMW5LeWjc4YJfAACA8+L9Soqv4ayofqQaX/UFAAA4R5S9+M7ClzjrBwAAcGbYnzpDXtH8WIby7/BiAAAA7v8nvbzi5+pw0B8AAOB0mpF2xTWRPwAAwKkY1ca7ih+shvwBAABOxewWfMVfvjWVPx/1BQCAWOnFehretN2fK/4AACBS8tEeiEP+AAAANhTZQ/4AAADZkv8wH+2TIX8AAED+gSkS+QMAAFhRZCXaJ0P+AACA/ANr968hfwAAABvy19vuj/wBAABOZxhru38D+QMAANiQv96L8FrIHwAAwIojq1ofrGf4YAXeDQAAiJRmpEX/vGlKg1cDAABixbQvTus1P2XkDwAAcDqm7f5aT/rXkD8AAMDpFIZx5v07ho/V5dUAAIBoMW2M09kZl490TwMAACCAacffsKHxqSrIHwAA4CyMi+M9jS1/picYFd9bDAAAYIpxx59GTxaGyB8AAOBMhhGG/sbpjGGZFwMAAOKlYyzKFW2PlDfuYuR2XwAAiJkVY1Gqu+DfPPDnmD8AAMRM2dyUylrjBQL/Hu8FAABETN5c/so+71OLbjsDAAAgS2cYV+K/KPA8NPsDAEDUCBT9hx1FHf8Sm5kKrwUAAMSMQNF/OGyqeZzacBhfCyMAAIAoEkV/Pef9SiJPw1sBAABx0xHxpY5MeaEn8Sz0+wEAQOSsDKOxf15mI0O/HwAARE55GIv9hdzP/X4AABA9w0jsL+V+Sv4AABA9TSn7++36E3M/JX8AAIieipT8h02P5/0LUu5XdmEhAACADW2KyX/Y8XZCvtgTewhO+QMAQPx05Ozf81T4r8o9QpcXAgAA4kfQnH5S//mm4AOs8EIAAED8FCTlP+yVXY+/3JMcP1l/AADIAi1R+w+bBadbl6bo4Mn6AwBAJqjIyn/YqznL/edrPdmxk/UHAIBMkB9K46rxr9KTHnmB1wEAADJBQ9z+w64D/Ve64sPu8DIAAEA2KA2HNvRvNfmfr3UtDLrCywAAABnBhkePa//WkuiFRs/KiHkVAAAgK1SHlmja+ERevtKxNFy+5gsAAJkh37Nl/2FXOvwvN+wNlnY/AADIDo2hRVpy1X+b5h8OG7wIAACQHQpDuzQl/G/X/AT+AABA6C99iq5qcnNuodq0PkICfwAAyBSloQO6jUqa4LpQaXRdDI/AHwAAskVr6IZuszrCCYB8qdbsORoZgT8AABD629wB1Mqli7RfqbW6LgdF4A8AAIT+tum1WrVatVQqFf82/hG1WqPVcT4YPukDAADZozDMNL08rwAAAGSORqblz63+AACQxdC/l2H3t1h/AADIIrUMy7/I8gMAQBbJdzPrfr7oAwAAGaWcVfd3WHsAAMgqTZL+AAAA2SKjPX9VVh4AALJLlU5/AACAjNHKnvu53gcAALJNvkfBHwAAIFtkruOfq/0AACDzrGTL/XzIFwAAINfJkvtp9gMAAMjWeb8OzX4AAABHlDLj/i7uBwAA+ERWTvv3aPQHAAD4kwbuBwAAyBgt3A8AAJAt8h3cDwAAgP1xPwAAQNT278Z9xg/3AwAAfEsx5uP+nO8HAAA4zf7xxv5N3A8AAHAa0db9uc8fAAAgW/bnO34AAACZsj9t/gAAAOcS3V1/Lcr9AAAA51OLy/01VhQAAOAiyhEd+euVWE8AAICLKUZT+OeEHwAAQDLycRT+e2WWEgAAICmVHmE/AABAtiiEnvrvEvYDAACMSNhd/yuE/QAAACNTbIV7tr/A8gEAAKSh2iPjDwAAkC1CbPvvVVk3AAAAA0qB5f57NYr9AAAAhpS7qB8AACBjVLqoHwAAAP2jfgAAgMj1r/zSn24F9QMAAAhTaio+119hfQAAACxQqOk8998osjYAAAC2qKgL/7uU+gEAACyH/1VNzX9NLvMDAABwQHGlpyTo5wp/AAAAV5Qbvv3fa5RYBgAAgOz4v0l7PwAAQIb83+RMPwAAgD+KKx3MDwAAkDEKlaajBEC3QXM/AACAlgRAzfqnf1tV7vIBAADQRcneBqBVo7UfAABAaQag2hC+A6iH+AEAALSTL9WaXRnvr1S4xgcAACAUSpVaK/0WoNOslfE+AABAgBRLtZXWKK0ArVatWkL7AAAAEWwCyrXjbUCrc6rwj5Rfq5VLtPMDgAj/DzJCuqLWO2gIAAAAAElFTkSuQmCC`;
