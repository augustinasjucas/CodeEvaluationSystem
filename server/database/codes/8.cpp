#include <bits/stdc++.h>
using namespace std;
vector<int> mas;
int main(){
   long long a, b; 
   mas.resize(100000000);
   for(int i = 0; i < 100000000; i++) mas[i] = i;
   cin >> a >> b;
   cout << a + b + mas[0];
   return 0;
}