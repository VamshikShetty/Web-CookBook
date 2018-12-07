from flask import Flask,render_template,request,Response,flash,redirect,session
import os
import sys
import random
import string

current_folder = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_folder+'/templates/py_dbs/')
import dbs_connect as dbs_c

app = Flask(__name__)

# required for session to work
app.config['SECRET_KEY']= ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(32))
array=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

#
# dbs project
#
@app.route('/register/')
def register():
	try:
		return render_template('register.html')
	except Exception as e:
		return str(e)


@app.route('/get_register/',methods=['POST','GET'])
def get_register():
	try:
		if request.method=='POST':
			#return str(request.form)
			name = request.form['username']
			password = request.form['password']
			email = request.form['email']
			b=0
			b = dbs_c.register(name,password,email)
			#return str(b)
			if b==0:
				flash("Username Exists try again")
				return redirect('/register/')
			else:
				session['username']=name
				session['password']=password
				return redirect('/lets_game/')
		else:
			flash("please input details")
			return redirect('/register/')
	except Exception as e:
		return str(e)

@app.route('/')
def home():
	try:
		session.pop('username',None)
		session.pop('password', None)

		return render_template('login.html')
	except Exception as e:
		return str(e)


@app.route('/check_cr/',methods=['GET','POST'])
def check_cr():
        try:
                if request.method=='POST':
                        name = request.form['name']
                        password = request.form['password']
                        session['username']=name
                        session['password']=password
                        return redirect('/lets_game/')
                else:
                        return redirect('') 
        except Exception as e:
                return str(e)


@app.route('/lets_game/')
def sending_data(attempts=3):
	try:
		if session['username']!=None:
			name=session['username']
			password = session['password']
			res = dbs_c.check_credit(name,password)

			if res==1:
				if attempts!=0:
					rank,mscore = dbs_c.get_rank_score(name)
					q_id_array = array[:]
					q_id = random.choice(q_id_array)
					q_id_array.remove(q_id)
					session['q_id'] = q_id
					session['score']=0
					session['q_id_array'] = q_id_array
					session['attempts']   = attempts

					Question_link = dbs_c.get_question(q_id)

					return render_template('home_page.html',ms=mscore,attempts=attempts, question_link = Question_link ,username=name,rank=rank,score=session['score'],arr=q_id_array)
			elif res==0:
				session.pop('username', None)
				flash("Invalid password")
			else:
				session.pop('username', None)
				flash("Invalid Username")
		return redirect('')

	except Exception as e:
		return str(e)

@app.route('/high_score/',methods=['GET','POST'])
def high_score():
	return str(dbs_c.high_score())

@app.route('/submit_answer/',methods=['GET','POST'])
def submit_answer():
        try:
                if request.method=='POST' and session['username']!=None:
                        answer =  str(request.form['answer'])
                        name = session['username']
                        q_id_array= session['q_id_array']
                        q_id=session['q_id']

                        res = dbs_c.check_answer(q_id,answer)
                        if res:
                                session['score']=session['score']+5
                                dbs_c.update_score(name,session['score'])
                        else:
                                session['attempts']=session['attempts'] -1
                                if session['attempts']<1:
                                        flash('Game Over')
                                        return redirect('/logout/')
                        q_id = random.choice(q_id_array)
                        session['q_id']=q_id
                        q_id_array.remove(q_id)
                        session['q_id_array']=q_id_array
                        attempts = session['attempts']

                        Question_link = dbs_c.get_question(q_id)

                        rank,mscore = dbs_c.get_rank_score(name)
                        return render_template('home_page.html',ms=mscore,attempts=attempts, question_link = Question_link ,rank=rank,score=session['score'],username=name)


                return redirect('/logout/')
        except Exception as e:
                return str(e)

@app.route('/logout/',methods=['GET','POST'])
def logout():
	session.pop('username', None)
	session.pop('q_id_array', None)
	session.pop('attempts', None)
	session.pop('score',None)
	session.pop('q_id',None)
	return redirect('')





if __name__=="__main__":
	app.run()


