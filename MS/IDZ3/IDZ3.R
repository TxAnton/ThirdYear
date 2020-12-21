

x <- c(1,3,0,3,1,2,1,2,1,2,2,3,1,2,1,3,2,1,1,1,2,3,2,1,3,1,1,1,3,1,0,1,1,3,1,3,2,1,2,1,2,2,1,0,2,1,2,1,1,2)
y <- c(9.60, 6.02, 3.23, 8.41, 3.63, 8.25, 6.25, 7.48, 7.61, 5.64, 4.40, 4.09, 7.04, 8.93, 6.02, 8.49, 7.08,
         7.58, 8.20, 7.47, 7.47, 6.60, 7.14, 5.18, 3.54, 5.28, 5.77, 4.90, 4.67, 5.70, 6.88, 4.53, 7.26, 8.18,
         5.22, 11.85, 8.58, 2.82, 2.43, 3.65, 6.67, 8.08, 6.76, 4.47, 4.04, 8.61, 9.39, 8.38, 4.79, 9.56)

al<- 0.2
h <-1.4

#x <- c(2, 5, 0, 6, 3, 3, 2, 4, 6, 6, 0, 3, 3, 1, 2, 4, 4, 5, 0, 4, 3,
#       6, 6, 5, 5, 6, 6, 1, 6, 5, 4, 2, 5, 2, 2, 3, 3, 1, 5, 3, 3, 0, 0, 5,
#       2, 5, 1, 3, 3, 3)
#y <- c(8.07, 10.94, 10.22, 8.81, 7.28, 14.70, 9.04, 9.37, 11.02, 5.40,
#       12.19, 11.16, 9.15, 9.61, 11.57, 8.43, 13.15, 9.70, 15.20, 8.27, 8.78,
#       10.92, 9.37, 10.01, 10.65, 14.03, 7.33, 13.59, 4.79, 11.43, 8.77,
#       10.70, 10.05, 6.31, 5.79, 13.04, 10.91, 14.07, 15.33, 9.61, 9.28,
#       14.22, 8.45, 8.55, 7.35, 11.75, 11.32, 10.74, 8.01, 7.37)

#al<- 0.1
#h <- 1.5


plot(x,y,main="Result")
dat<-data.frame(y=y,x=x)
dat1<-dat[order(x),]




## 1)
# Linear model (code)
n<-length(y)
x0<-array(1,dim=n)
X<-t(matrix(c(x0,x),nrow=n,ncol=2))
Y<-as.matrix(y)
S<-X%*%t(X)
S1<-solve(S)
bhat<-S1%*%X%*%Y
print(bhat)

#Построение регрессии
plot(x,y,main="Linear regression")
x1<-c(min(x),max(x))
y1<-bhat[1]+bhat[2]*x1
points(x1,y1,"l",col="red",lwd=2)
## !1)




## 2)
#Несмещенная оценка дисперсии
res<-Y-t(X)%*%as.matrix(bhat)
SS<-sum(res^2)
s2<-SS/(n-2)
print(s2)

#Гистограмма
k<-5
#//brk<-min(res)+c(0:k)*(max(res)-min(res))/k

brk<-seq(min(res), max(res) + h, by=h)
hist(res,breaks=brk)

#Проверка нормальности ошибок на уровне alpha по xi2
#brk<-c(-Inf,-1,-0.2,0.5,1.1,Inf)

l.b<-length(brk)
brk[1]<- -Inf
brk[l.b]<-Inf

nu<-hist(res,breaks=brk,plot=FALSE)$counts
l.b<-length(brk)
csq0<-function(s){
  if (s>0){
    p<-pnorm(brk[2:l.b],0,s)-pnorm(brk[1:(l.b-1)],0,s)
    return(sum((nu-n*p)^2/n/p))
  } else {
    return(Inf)
  }
}
csq.s<-nlm(csq0,p=sqrt(s2))$minimum
pv<-pchisq(csq.s,k-2,lower.tail=FALSE)
print(csq.s<pv)

#Оценка расстояния до нормального рапределения по Колмагорову
kolm.stat<-function(s){
  sres<-sort(res)
  fdistr<-pnorm(sres,0,s)
  max(abs(c(0:(n-1))/n-fdistr),abs(c(1:n)/n-fdistr))
}
ks.dist<-nlm(kolm.stat,p=sqrt(s2))$minimum

plot.ecdf(res)

x2<-c(0:1000)*(max(res)-min(res))/1000+min(res)
y2<-pnorm(x2,0,nlm(kolm.stat,p=sqrt(s2))$estimate)
points(x2,y2,"l",col="red",lwd=2)
#Полученое расстояние
print(ks.dist)
## !2)




## 3)
# Confint 
#al = 0.1
C<-diag(c(1,1))
ph<-bhat #t(C)%*%bhat
V<-diag(S1) # diag(C%*%S1%*%t(C))
xa<-qt(1-al/2,n-2)
s1<-sqrt(s2)
d<-xa*s1*sqrt(V)
CI<-data.frame(lw=ph-d,up=ph+d)
#доверительный  интервал
print(CI)
#пару слов про эллипс
bhat
S1
## !3)




## 4)
FST<-bhat[2]^2/V[2]/s2
pv.f<-pf(FST,1,n-2,lower.tail=FALSE)
print(al<pv.f)
## !4)




## 5)
#Y=β1 + β2*x + β3*x^2 + eps
x0 <- array(1, dim=n)
X <- t(matrix(c(x0, x, x^2), nrow=n, ncol=3))
Y <- as.matrix(y)
S <- X%*%t(X)
S1 <- solve(S)
bht <- S1%*%X%*%Y
print(bht)

plot(x, y)
x1 <- seq(from = min(x), to = max(x), by = (0.5))
y1 <- bht[1] + bht[2] * x1 + bht[3] * x1^2
points(x1, y1, "l", col="red", lwd=2)
## !5)




## 6)
#Несм оценка дисперсии
res<-Y-t(X)%*%as.matrix(bht)
SS<-sum(res^2)
s2<-SS/(n-2)
print(s2)

#Гистограмма
#k<-5
#//brk<-min(res)+c(0:k)*(max(res)-min(res))/k
brk<-seq(min(res), max(res) + h, by=h)
hist(res,breaks=brk)

#Проверка нормальности ошибок на уровне alpha по xi2
#brk<-c(-Inf,-1,-0.2,0.5,1.1,Inf)

l.b<-length(brk)
brk[1]<- -Inf
brk[l.b]<-Inf
#r = length(breaks) - 1
hh<-hist(res,breaks=brk,plot=FALSE)
nu<-hh$counts

l.b<-length(brk)
csq0<-function(s){
  if (s>0){
    p<-pnorm(brk[2:l.b],0,s)-pnorm(brk[1:(l.b-1)],0,s)
    return(sum((nu-n*p)^2/n/p))
  } else {
    return(Inf)
  }
}
csq.s<-nlm(csq0,p=sqrt(s2))$minimum
pv<-pchisq(csq.s,k-3,lower.tail=FALSE)
print(csq.s<pv)

#Оценка расстояния до нормального рапределения по Колмагорову
kolm.stat<-function(s){
  sres<-sort(res)
  fdistr<-pnorm(sres,0,s)
  max(abs(c(0:(n-1))/n-fdistr),abs(c(1:n)/n-fdistr))
}
ks.dist<-nlm(kolm.stat,p=sqrt(s2))$minimum

plot.ecdf(res)

x2<-c(0:1000)*(max(res)-min(res))/1000+min(res)
y2<-pnorm(x2,0,nlm(kolm.stat,p=sqrt(s2))$estimate)
points(x2,y2,"l",col="red",lwd=2)
#Полученое расстояние
print(ks.dist)
## !6)




## 7)
# Доверительные интервалы b123
C<-diag(c(1,1,1))
ph<-bht #t(C)%*%bhat
V<-diag(S1) # diag(C%*%S1%*%t(C))
xa<-qt(1-al/2,n-2)
s1<-sqrt(s2)
d<-xa*s1*sqrt(V)
CI<-data.frame(lw=ph-d,up=ph+d)
#доверительный  интервал
print(CI)
#пару слов про эллипс
bht
S1
## !7)




## 8)
FST <- bht[2]^2/S1[2, 2]/s2
pv.f <- pf(FST, 1, n-2, lower.tail=FALSE)
print(al<pv.f)


#########
# Linear model (realization)
#q1<-lsfit(x,y)
#q <-lm(y~x)
#qs<-summary(q)
#bhat<-q$coefficients
#res<-q$residuals
#CI<-confint(q)
#V<-diag(qs$cov.unscaled)
#s1<-qs$sigma
#FST<-qs$fstatistic
#pv<-qs$coefficients[2,4]



