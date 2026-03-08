/*
 * HackerRank - Mini-Max Sum
 *
 * Given five positive integers, find the minimum and maximum values that can be
 * calculated by summing exactly four of the five integers.
 * Print the respective minimum and maximum values on a single line.
 */

#include <bits/stdc++.h>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

void miniMaxSum(vector<int> arr) {
    long long total = 0;
    for (int x : arr) total += x;

    long long largest  = *max_element(arr.begin(), arr.end());
    long long smallest = *min_element(arr.begin(), arr.end());

    // min sum = exclude the largest element, max sum = exclude the smallest
    cout << total - largest << " " << total - smallest << "\n";
}

int main() {
    string arr_temp_temp;
    getline(cin, arr_temp_temp);
    vector<string> arr_temp = split(rtrim(arr_temp_temp));
    vector<int> arr(5);
    for (int i = 0; i < 5; i++) {
        arr[i] = stoi(arr_temp[i]);
    }

    miniMaxSum(arr);

    return 0;
}

string ltrim(const string &str) {
    string s(str);
    s.erase(s.begin(), find_if(s.begin(), s.end(), [](unsigned char c) {
        return !isspace(c);
    }));
    return s;
}

string rtrim(const string &str) {
    string s(str);
    s.erase(find_if(s.rbegin(), s.rend(), [](unsigned char c) {
        return !isspace(c);
    }).base(), s.end());
    return s;
}

vector<string> split(const string &str) {
    vector<string> tokens;
    string::size_type start = 0;
    string::size_type end = 0;
    while ((end = str.find(" ", start)) != string::npos) {
        tokens.push_back(str.substr(start, end - start));
        start = end + 1;
    }
    tokens.push_back(str.substr(start));
    return tokens;
}
