#include <bits/stdc++.h>

using namespace std;

#define FAST_IO ios_base::sync_with_stdio(0); cin.tie(nullptr)
#define FOR(i, a, b) for (int i = (a); i <= (b); i++)
#define REP(n) FOR(O, 1, (n))
#define f first
#define s second
#define pb push_back
typedef long long ll;
typedef long double ld;
typedef pair<int, int> pii;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector<pii> vii;

const int MAXN = 500100;
const ll INF = 1e17;

int n;
ll k;
ll m;
vi adj[MAXN];
ll a[MAXN];
vi spec;
bool isSpec[MAXN];
bool toClose[MAXN];

bool doDp[MAXN];
int cntSpec[MAXN];
ll cost[MAXN];
ll dp[MAXN][3];

void dfs1 (int v, int p) {
    if (isSpec[v]) cntSpec[v]++;
    for (int u : adj[v]) {
        if (u == p) continue;
        dfs1 (u, v);
        cntSpec[v] += cntSpec[u];
    }

    if (isSpec[v]) doDp[v] = true;
    else if (cntSpec[v] > 0 && (k-cntSpec[v]) > 0) doDp[v] = true;
}

void dfs2 (int v, int p = -1) {
    cost[v] = m;
    for (int u : adj[v]) {
        if (u == p) continue;
        if (doDp[u]) continue;
        dfs2(u, v);
        cost[v] += cost[u];
    }

    if (p != -1) cost[v] = min(cost[v], a[v]);
}

void dfs3 (int v, int p = -1) {
    ll sum0 = 0, sumAll = 0, sum1 = 0;
    ll sum02 = 0;
    ll sum01 = 0;
    for (int u : adj[v]) {
        if (u == p) continue;
        if (!doDp[u]) continue;
        dfs3(u, v);

        sum1 += dp[u][1];
        sum0 += dp[u][0];
        sumAll += min(min(dp[u][0], dp[u][1]), dp[u][2]);
        sum02 += min(dp[u][0], dp[u][2]);
        sum01 += min(dp[u][0], dp[u][1]);

        sum0 = min(sum0, INF);
        sum1 = min(sum1, INF);
        sumAll = min(sumAll, INF);
        sum02 = min(sum02, INF);
        sum01 = min(sum01, INF);
    }

    if (!isSpec[v]) {
        dp[v][0] = sumAll + a[v];
        dp[v][2] = min(sum02, dp[v][0]);
    } else dp[v][0] = dp[v][2] = INF;
    dp[v][0] = min(dp[v][0], INF);
    dp[v][2] = min(dp[v][2], INF);

    dp[v][1] = sum01 + cost[v];

    //FOR(xx, 0, 1) dp[v][xx] = min(dp[v][xx], INF);

    //cout << " v = " << v << "  dp0 =  " << dp[v][0] << "  dp1 = " << dp[v][1] << endl;
}

void sub6() {
    dfs1(1, -1);
    /*FOR(i, 1,n) {
        if (doDp[i])
            dfs2(i, -1);
    }*/
    FOR(i, 1, n) doDp[i] = true;
    FOR(i ,1, n) cost[i] = m;

   // FOR(i,1 , n) cout << " i = " << i <<  " doDp = " << doDp[i] << " cost = " << cost[i] << endl;

    int r = spec[0];
    dfs3 (r, -1);

    cout << dp[r][1] << "\n";
}

int main()
{
    FAST_IO;

    cin >> n >> k >> m;
   // bool isSub2 = true;
    REP(n-1) {
        int u, v; cin >> u >> v;
        adj[u].pb(v);
        adj[v].pb(u);

      //  if (abs(u-v) != 1) isSub2 = false;
    }
    FOR(i, 1, n) cin >> a[i];
    REP(k) {
        int v; cin >> v;
        spec.pb(v);
        isSpec[v] = true;
    }

   // cout << " sub2 rez: " << endl;
    //sub2();
    //cout << endl << endl;

   /* cout << " sub6 rez: " << endl;
    sub6();
    cout << endl << endl; */

    sub6();
    return 0;

    /*if (k == 1) sub3();
    else if (isSub2) sub2();
    else if (k == 2) sub4();
    else sub1();*/

    return 0;
}