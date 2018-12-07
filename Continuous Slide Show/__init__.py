from flask import Flask,render_template,session,url_for,request,redirect


app = Flask(__name__)


@app.route('/')
def home():
        try:
                
                return render_template("Continuous_Slide_Show.html",num = 15)
        except Exception as e:
                return str(e)


if __name__=="__main__":
	app.run()


