import pymysql
import pymysql.cursors
from passlib.hash import sha256_crypt


def connection():
	try:
		conn = pymysql.connect(host='localhost', user = 'root', passwd = 'dbslab17',db = 'dbs',charset='utf8')
		# charset='utf8' part is important because the latin-1 was gving unicodeerror while inserting string based data
		c = conn.cursor()
		return conn,c
	except Exception as e:
		#print str(e)
		return str(e)

def check_credit(username,password):

	try:
		conn,c = connection()
		exe_str = "call check_password(\'" + username+ "\')"
		res = c.execute(exe_str)
		passw = c.fetchone()

		if passw==None:
			return -1
			# if user doesnt exist
		else:
			if sha256_crypt.verify(password,passw[0]):
				return 1
				#if user exist and password is correct
			else:
				return 0
				#if user exist and password is not correct

	except Exception as e:
		print(str(e))
		return str(e)
	finally:
		c.close()
		conn.close()
#print(check_credit('vamshik2',"vamshik"))


def register(username,password,email):
        try:
                conn,cur = connection()
                password = sha256_crypt.encrypt(password)
                exe_str = "call register(\'"+username+"\',\'"+password+"\',\'"+email+"\')"
		#print(exe_str)
                res = cur.execute(exe_str)
                res = cur.fetchone()
                conn.commit()
                return res[0]
        except Exception as e:
                print(str(e))

        finally:
                cur.close()
                conn.close()

#print(register('lol1','lol1@gmil.com','lol1'))

def check_answer(q_id,answer):
        try:
                conn,cur = connection()
                exe_str = "call check_answer(" + str(q_id)+ ",\'"+answer+"\')"
                res = cur.execute(exe_str)
                res = cur.fetchone()
                if res==None:
                        return False
                return True
        except Exception as e:
                print(str(e))
        finally:
                cur.close()
                conn.close()


def get_question(q_id):
        try:
                conn,cur = connection()
                exe_str = "call get_question(" + str(q_id)+ ")"
                res = cur.execute(exe_str)
                res = cur.fetchone()
                if res==None:
                        return None
                return res[0]
        except Exception as e:
                print(str(e))

        finally:
                cur.close()
                conn.close()




#x = check_answer(2,'shipsd');
#print(x)


def get_rank_score(username):
        try:
                conn,cur = connection()
                exe_str = "call get_rank_score(\'" + str(username)+ "\')"
                res = cur.execute(exe_str)
                res = cur.fetchone()
                conn.commit()
                if res==None:
                        return None
                return res
        except Exception as e:
                print(str(e))
        finally:
                cur.close()
                conn.close()

#print(get_rank_score('user'))

def update_score(username,score):
        try:
                conn,cur = connection()
                exe_str = "call update_score (\'" + username+ "\'," +str(score) + ");"
                cur.execute(exe_str)

                # commit those changes which are done by procedure
                conn.commit()
        except Exception as e:
                print(str(e))

        finally:
                cur.close()
                conn.close()

#print(update_score('user',2))

def high_score():
        try:
                conn,cur = connection()
                exe_str = "call high_score()"
                res = cur.execute(exe_str)
                res=cur.fetchone()
                results=[]
                while res!=None:
                        results.append(res)
                        res=cur.fetchone()
                res=""
                for i in results:
                        res= res + "Rank:"+str(i[1])+"  Name: "+str(i[0])+" Score: "+str(i[2])+"</br>"
                return res
        except Exception as e:
                print(str(e))

        finally:
                cur.close()
                conn.close()

#print(high_score())
