import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import math
import scipy.interpolate
import numpy as np


t13 = [[-3,     -2,     -1,     0,  1,      2,      3],
       [-27.3,  -18.2,  -9.5,   0,  9.3,    18.6,   27.8]]
plt.title("ВАХ линейного резистора")
plt.xlabel("U, В")
plt.ylabel("I, мА")

t = t13
plt.plot(t[0],t[1],'-ro')

plt.show()








t14 = [[-3,     -2.5,   -2,     -1.5,   -1, -0.5,   0,  0.5,    1,  1.5,    2],
       [-2.9,   -2.4,   -1.9,   -1.5,   -1, -0.5,   0,  0.5,    6,  14.6,   23.5]]

t = t14
plt.title("ВАХ нелинейного резистора")
plt.plot(t[0],t[1],'-ro')
plt.show()

space = np.linspace(-8,5,1000)
y_interp = scipy.interpolate.interp1d(t14[0], t14[1])
yy = [2*math.sin(i) for i in space]
y = [y_interp(i) for i in yy]

plt.plot(space,y,'-r')
#plt.plot(space,yy,':b')
plt.title("Сигнал от нелинейного резистора")
plt.show()



t11 = [[20,    40,    60,    80,    100,   120,   140,   160,   180,   200],
       [1,     1,     1,     1,     1,     1,     1,     1,     1,     1],
       [0.0468,0.0243,0.0154,0.0118,0.0092,0.0077,0.0065,0.0057,0.0050,0.0046]]

#r = [t11[2][i] * t11[0][i] for i in range(len(t11[0]))]
#print(r)
plt.plot(t11[2],t11[1],'-r.')
plt.title("ВАХ источника постоянного напряжения")
plt.show()


t12 = [[20,    80,    140,   200],
       [0.37,  0.78,  0.93,  1],
       [0.0177,0.0093,0.0061,0.0046]]

r = [abs(t12[1][i+1]-t12[1][i])/abs(t12[2][i+1]-t12[2][i]) for i in range(len(t12[0])-1)]
print(r)
print(sum(r[1:])/len(r[1:]))
plt.plot(t12[2],t12[1])
#plt.plot([1,2,3],r)
plt.title("ВАХ ГС")
plt.show()

