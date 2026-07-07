/*
 * Problem: K Closest Points to Origin (LeetCode 973)
 * Link: https://leetcode.com/problems/k-closest-points-to-origin/
 * Difficulty: Medium
 * Category: Heaps and Priority Queues
 *
 * Description:
 * Given an array of points where points[i] = [xi, yi] represents a point on
 * the X-Y plane and an integer k, return the k closest points to the origin
 * (0, 0). The distance from (0,0) to (x,y) is sqrt(x²+y²). You may return
 * the answer in any order. The answer is guaranteed to be unique.
 *
 * Example 1: points=[[1,3],[-2,2]] k=1  → [[-2,2]]
 *   dist([1,3])=√10 > dist([-2,2])=√8 → [-2,2] is closer
 * Example 2: points=[[3,3],[5,-1],[-2,4]] k=2 → [[3,3],[-2,4]]
 *
 * Constraints:
 * - 1 <= k <= points.length <= 10^4
 * - -10^4 <= xi, yi <= 10^4
 */

#include <vector>
#include <algorithm>
#include <queue>
#include <cmath>
#include <iostream>
using namespace std;

using Point = vector<int>;
auto dist2 = [](const Point& p){ return p[0]*p[0] + p[1]*p[1]; };

/*
 * APPROACH 1: SORT BY DISTANCE²
 *
 * Sort all points by squared distance, return first k.
 * Avoids sqrt; easy to implement.
 *
 * Time:  O(n log n)
 * Space: O(1) in-place
 */
class Solution1 {
public:
    vector<Point> kClosest(vector<Point>& points, int k) {
        sort(points.begin(), points.end(),
             [](const Point& a, const Point& b){ return dist2(a) < dist2(b); });
        return { points.begin(), points.begin() + k };
    }
};

/*
 * APPROACH 2: MAX HEAP OF SIZE K
 *
 * Maintain a max-heap of size k keyed by distance².
 * For each point: if heap size < k push; else if dist < heap top, replace.
 * Heap top is always the farthest of the k closest seen so far.
 *
 * Time:  O(n log k)
 * Space: O(k)
 */
class Solution2 {
public:
    vector<Point> kClosest(vector<Point>& points, int k) {
        // Max-heap: (dist², index)
        priority_queue<pair<int,int>> pq;
        for (int i = 0; i < (int)points.size(); i++) {
            pq.push({dist2(points[i]), i});
            if ((int)pq.size() > k) pq.pop();
        }
        vector<Point> res;
        while (!pq.empty()) {
            res.push_back(points[pq.top().second]);
            pq.pop();
        }
        return res;
    }
};

/*
 * APPROACH 3: QUICKSELECT (AVERAGE O(n))
 *
 * Partition around pivot until the first k elements are the k closest.
 * nth_element in STL does this in O(n) average.
 *
 * Time:  O(n) average, O(n²) worst
 * Space: O(1)
 */
class Solution3 {
public:
    vector<Point> kClosest(vector<Point>& points, int k) {
        nth_element(points.begin(), points.begin() + k, points.end(),
                    [](const Point& a, const Point& b){ return dist2(a) < dist2(b); });
        return { points.begin(), points.begin() + k };
    }
};

/*
 * APPROACH 4: PARTIAL SORT (O(n log k))
 *
 * partial_sort guarantees first k are sorted by distance.
 * Cleaner than full sort; slightly better for k << n.
 *
 * Time:  O(n log k)
 * Space: O(1)
 */
class Solution4 {
public:
    vector<Point> kClosest(vector<Point>& points, int k) {
        partial_sort(points.begin(), points.begin() + k, points.end(),
                     [](const Point& a, const Point& b){ return dist2(a) < dist2(b); });
        return { points.begin(), points.begin() + k };
    }
};

/*
 * APPROACH 5: MANUAL QUICKSELECT
 *
 * In-place partition-based selection: find the pivot position such that
 * all points left of pivot are closer than all points right of it.
 *
 * Time:  O(n) average
 * Space: O(log n) recursion stack
 */
class Solution5 {
    int partition(vector<Point>& pts, int lo, int hi) {
        int pivot = dist2(pts[hi]), i = lo;
        for (int j = lo; j < hi; j++)
            if (dist2(pts[j]) <= pivot) swap(pts[i++], pts[j]);
        swap(pts[i], pts[hi]);
        return i;
    }
    void quickselect(vector<Point>& pts, int lo, int hi, int k) {
        if (lo >= hi) return;
        int p = partition(pts, lo, hi);
        if (p == k) return;
        if (p < k) quickselect(pts, p+1, hi, k);
        else quickselect(pts, lo, p-1, k);
    }
public:
    vector<Point> kClosest(vector<Point>& points, int k) {
        quickselect(points, 0, (int)points.size()-1, k);
        return { points.begin(), points.begin() + k };
    }
};

void print(const vector<Point>& v) {
    cout << "[";
    for (int i=0;i<(int)v.size();i++) {
        cout << "[" << v[i][0] << "," << v[i][1] << "]";
        if (i+1<(int)v.size()) cout << ",";
    }
    cout << "]";
}

int main() {
    auto run = [](vector<Point> pts, int k) {
        cout << "k=" << k << "  ";
        { Solution1 s; auto r=s.kClosest(pts,k); cout<<"Sort:    "; print(r); cout<<"\n"; }
        { vector<Point> p2=pts; Solution2 s; auto r=s.kClosest(p2,k); cout<<"MaxHeap: "; print(r); cout<<"\n"; }
        { vector<Point> p3=pts; Solution3 s; auto r=s.kClosest(p3,k); cout<<"QSel:    "; print(r); cout<<"\n"; }
        { vector<Point> p4=pts; Solution4 s; auto r=s.kClosest(p4,k); cout<<"PSort:   "; print(r); cout<<"\n"; }
        { vector<Point> p5=pts; Solution5 s; auto r=s.kClosest(p5,k); cout<<"ManQSel: "; print(r); cout<<"\n"; }
        cout << "\n";
    };
    run({{1,3},{-2,2}}, 1);
    run({{3,3},{5,-1},{-2,4}}, 2);
    run({{0,1},{1,0}}, 2);
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (Sort):           Time O(n log n)   Space O(1)
 * Approach 2 (Max Heap k):     Time O(n log k)   Space O(k)
 * Approach 3 (nth_element):    Time O(n) avg     Space O(1)
 * Approach 4 (partial_sort):   Time O(n log k)   Space O(1)
 * Approach 5 (Manual QSelect): Time O(n) avg     Space O(log n)
 *
 * KEY INSIGHT: Use squared distance to avoid sqrt.
 */

// Made with Bob
