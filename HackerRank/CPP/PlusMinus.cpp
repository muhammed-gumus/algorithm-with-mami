/*
 * HackerRank - Plus Minus
 *
 * Given an array of integers, calculate the ratios of its elements that are
 * positive, negative, and zero. Print the decimal value of each fraction on a
 * new line with 6 places after the decimal.
 */

#include <bits/stdc++.h>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

void plusMinus(vector<int> arr) {
    int n = arr.size();
    int pos = 0, neg = 0, zer = 0;

    for (int x : arr) {
        if (x > 0) pos++;
        else if (x < 0) neg++;
        else zer++;
    }

    cout << fixed << setprecision(6) << (double)pos / n << "\n";
    cout << fixed << setprecision(6) << (double)neg / n << "\n";
    cout << fixed << setprecision(6) << (double)zer / n << "\n";
}

int main() {
    string n_temp;
    getline(cin, n_temp);
    int n = stoi(ltrim(rtrim(n_temp)));

    string arr_temp_temp;
    getline(cin, arr_temp_temp);
    vector<string> arr_temp = split(rtrim(arr_temp_temp));
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        arr[i] = stoi(arr_temp[i]);
    }

    plusMinus(arr);

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
