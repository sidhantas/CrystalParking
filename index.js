import nodemailer from "nodemailer"
import request from 'request';
import notifier from "node-notifier"

process.loadEnvFile();

const main = async () => {
    var options = {
        'method': 'POST',
        'url': 'https://parking.crystalmountainresort.com//events/?rettype=collective&start=2026-03-01&end=2026-04-01',
        'headers': {
            'Cache-Control': 'no-cache',
            'Cookie': 'PHPSESSID=0ot0hjcqio28obn1enhrv0bmab'
        }
    };;
    request(options, async function(error, response) {
        if (error) throw new Error(error);
        response = JSON.parse(response.body);
        for (let value of response) {
            let date = value["start"].split("T")[0]
            if (date == "2026-03-14") {
                if (value["className"] == "fc-available") {
                    console.log("Reservation available");
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWD
                        }
                    });


                    await transporter.sendMail({
                        from: "ME",
                        to: "sidhantasharma41@gmail.com",
                        subject: "Reservation Available",
                        text: "Reservation Available"
                    })

                    notifier.notify('Reservation Available');
                } 
            }
        }
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


while (true) {
    await sleep(10000);
    try {
        main();
    } catch (err) {
        console.log("Caught error: {}", err);
    }
}
