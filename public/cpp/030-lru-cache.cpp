/*
 * LeetCode Problem #146: LRU Cache
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/lru-cache/
 * 
 * Problem Statement:
 * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
 * 
 * Implement the LRUCache class:
 * - LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
 * - int get(int key) Return the value of the key if the key exists, otherwise return -1.
 * - void put(int key, int value) Update the value of the key if the key exists.
 *   Otherwise, add the key-value pair to the cache. If the number of keys exceeds
 *   the capacity from this operation, evict the least recently used key.
 * 
 * The functions get and put must each run in O(1) average time complexity.
 */

#include <unordered_map>
#include <list>
#include <iostream>
using namespace std;

// ==================== APPROACH 1: HashMap + Doubly Linked List (Optimal) ====================
/*
 * Algorithm:
 * - Use doubly linked list to maintain order (most recent at head)
 * - Use hash map for O(1) access to nodes
 * - get(): Move accessed node to head
 * - put(): Add to head, evict tail if capacity exceeded
 * 
 * Time Complexity: O(1) for both get and put
 * Space Complexity: O(capacity)
 * 
 * When to use: This is the OPTIMAL solution
 * 
 * Key Insight:
 * - Doubly linked list allows O(1) removal and insertion
 * - Hash map provides O(1) lookup
 * - Head = most recently used, Tail = least recently used
 */

// Custom doubly linked list node
struct Node {
    int key;
    int value;
    Node* prev;
    Node* next;
    
    Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

class LRUCache_Optimal {
private:
    int capacity;
    unordered_map<int, Node*> cache;  // key -> node pointer
    Node* head;  // Most recently used
    Node* tail;  // Least recently used
    
    // Add node right after head (most recent position)
    void addNode(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }
    
    // Remove node from its current position
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    // Move node to head (mark as most recently used)
    void moveToHead(Node* node) {
        removeNode(node);
        addNode(node);
    }
    
    // Remove least recently used node (tail)
    Node* removeTail() {
        Node* node = tail->prev;
        removeNode(node);
        return node;
    }
    
public:
    LRUCache_Optimal(int capacity) : capacity(capacity) {
        // Create dummy head and tail
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;
        tail->prev = head;
    }
    
    int get(int key) {
        if (cache.find(key) == cache.end()) {
            return -1;
        }
        
        Node* node = cache[key];
        moveToHead(node);  // Mark as recently used
        return node->value;
    }
    
    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            // Key exists, update value and move to head
            Node* node = cache[key];
            node->value = value;
            moveToHead(node);
        } else {
            // New key
            Node* newNode = new Node(key, value);
            cache[key] = newNode;
            addNode(newNode);
            
            if (cache.size() > capacity) {
                // Evict LRU
                Node* lru = removeTail();
                cache.erase(lru->key);
                delete lru;
            }
        }
    }
    
    ~LRUCache_Optimal() {
        // Clean up all nodes
        Node* current = head;
        while (current != nullptr) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }
};

// ==================== APPROACH 2: Using STL list and unordered_map ====================
/*
 * Algorithm:
 * - Use std::list for doubly linked list
 * - Use unordered_map to store key -> list iterator
 * - Leverage STL's splice for O(1) move operations
 * 
 * Time Complexity: O(1) for both get and put
 * Space Complexity: O(capacity)
 * 
 * When to use: When you want cleaner code using STL
 * 
 * Key Insight:
 * - STL list provides splice() for O(1) element movement
 * - Store iterators in map for O(1) access
 */
class LRUCache_STL {
private:
    int capacity;
    list<pair<int, int>> cache;  // list of (key, value) pairs
    unordered_map<int, list<pair<int, int>>::iterator> map;  // key -> iterator
    
public:
    LRUCache_STL(int capacity) : capacity(capacity) {}
    
    int get(int key) {
        if (map.find(key) == map.end()) {
            return -1;
        }
        
        // Move to front (most recently used)
        cache.splice(cache.begin(), cache, map[key]);
        return map[key]->second;
    }
    
    void put(int key, int value) {
        if (map.find(key) != map.end()) {
            // Update existing key
            cache.splice(cache.begin(), cache, map[key]);
            map[key]->second = value;
        } else {
            // Add new key
            if (cache.size() == capacity) {
                // Evict LRU (back of list)
                int lruKey = cache.back().first;
                cache.pop_back();
                map.erase(lruKey);
            }
            
            cache.push_front({key, value});
            map[key] = cache.begin();
        }
    }
};

// ==================== APPROACH 3: Ordered Map (Not O(1)) ====================
/*
 * Algorithm:
 * - Use ordered map with timestamp as key
 * - Track access time for each key
 * - Find and remove oldest on eviction
 * 
 * Time Complexity: O(log n) for operations
 * Space Complexity: O(capacity)
 * 
 * When to use: NOT recommended - doesn't meet O(1) requirement
 * 
 * Note: This approach is shown for comparison but doesn't meet
 * the problem's O(1) requirement
 */
class LRUCache_OrderedMap {
private:
    int capacity;
    int timestamp;
    unordered_map<int, int> values;  // key -> value
    unordered_map<int, int> times;   // key -> last access time
    
public:
    LRUCache_OrderedMap(int capacity) : capacity(capacity), timestamp(0) {}
    
    int get(int key) {
        if (values.find(key) == values.end()) {
            return -1;
        }
        
        times[key] = timestamp++;
        return values[key];
    }
    
    void put(int key, int value) {
        if (values.find(key) != values.end()) {
            values[key] = value;
            times[key] = timestamp++;
        } else {
            if (values.size() == capacity) {
                // Find LRU key (O(n) operation)
                int lruKey = -1;
                int minTime = INT_MAX;
                for (auto& p : times) {
                    if (p.second < minTime) {
                        minTime = p.second;
                        lruKey = p.first;
                    }
                }
                values.erase(lruKey);
                times.erase(lruKey);
            }
            
            values[key] = value;
            times[key] = timestamp++;
        }
    }
};

// Use optimal implementation by default
typedef LRUCache_Optimal LRUCache;

// ==================== TEST CASES ====================
void runTests() {
    cout << "Test 1: Basic operations" << endl;
    LRUCache cache1(2);
    cache1.put(1, 1);
    cache1.put(2, 2);
    cout << "get(1): " << cache1.get(1) << endl;  // Expected: 1
    cache1.put(3, 3);  // Evicts key 2
    cout << "get(2): " << cache1.get(2) << endl;  // Expected: -1
    cache1.put(4, 4);  // Evicts key 1
    cout << "get(1): " << cache1.get(1) << endl;  // Expected: -1
    cout << "get(3): " << cache1.get(3) << endl;  // Expected: 3
    cout << "get(4): " << cache1.get(4) << endl;  // Expected: 4
    
    cout << "\nTest 2: Update existing key" << endl;
    LRUCache cache2(2);
    cache2.put(1, 1);
    cache2.put(2, 2);
    cache2.put(1, 10);  // Update key 1
    cout << "get(1): " << cache2.get(1) << endl;  // Expected: 10
    cache2.put(3, 3);  // Evicts key 2
    cout << "get(2): " << cache2.get(2) << endl;  // Expected: -1
    
    cout << "\nTest 3: Single capacity" << endl;
    LRUCache cache3(1);
    cache3.put(1, 1);
    cout << "get(1): " << cache3.get(1) << endl;  // Expected: 1
    cache3.put(2, 2);  // Evicts key 1
    cout << "get(1): " << cache3.get(1) << endl;  // Expected: -1
    cout << "get(2): " << cache3.get(2) << endl;  // Expected: 2
    
    cout << "\nTest 4: Access pattern" << endl;
    LRUCache cache4(3);
    cache4.put(1, 1);
    cache4.put(2, 2);
    cache4.put(3, 3);
    cout << "get(1): " << cache4.get(1) << endl;  // Expected: 1 (1 becomes most recent)
    cache4.put(4, 4);  // Evicts key 2 (LRU)
    cout << "get(2): " << cache4.get(2) << endl;  // Expected: -1
    cout << "get(1): " << cache4.get(1) << endl;  // Expected: 1
    cout << "get(3): " << cache4.get(3) << endl;  // Expected: 3
    cout << "get(4): " << cache4.get(4) << endl;  // Expected: 4
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. HashMap + Custom Doubly Linked List (RECOMMENDED):
 *    Time: O(1) for get and put
 *    Space: O(capacity)
 *    Most control, optimal performance
 * 
 * 2. HashMap + STL list:
 *    Time: O(1) for get and put
 *    Space: O(capacity)
 *    Cleaner code, uses STL
 * 
 * 3. Ordered Map with Timestamp:
 *    Time: O(n) for eviction
 *    Space: O(capacity)
 *    Does NOT meet O(1) requirement
 * 
 * INTERVIEW TIPS:
 * - Explain why both hash map and linked list are needed
 * - Hash map provides O(1) lookup
 * - Doubly linked list provides O(1) insertion/deletion
 * - Draw the data structure showing both components
 * - Explain eviction policy clearly
 * - Discuss dummy head/tail nodes to simplify edge cases
 * - Mention STL alternative if time permits
 * - Walk through example showing cache state changes
 * 
 * KEY INSIGHTS:
 * - Need O(1) for both access and eviction
 * - Hash map alone can't maintain order
 * - Linked list alone can't provide O(1) lookup
 * - Combination gives best of both worlds
 * - Doubly linked list needed for O(1) removal
 * - Dummy nodes simplify boundary conditions
 * 
 * STEP-BY-STEP for capacity=2:
 * 
 * put(1,1): [1] (1 is MRU)
 * put(2,2): [2,1] (2 is MRU)
 * get(1):   [1,2] (1 becomes MRU, returns 1)
 * put(3,3): [3,1] (evict 2, 3 is MRU)
 * get(2):   [3,1] (returns -1, not found)
 * put(4,4): [4,3] (evict 1, 4 is MRU)
 * 
 * COMMON MISTAKES:
 * - Using singly linked list (can't remove in O(1))
 * - Not updating order on get() operations
 * - Forgetting to remove from hash map on eviction
 * - Memory leaks (not deleting evicted nodes)
 * - Not handling capacity = 1 edge case
 * - Incorrect eviction (removing wrong element)
 * - Not using dummy nodes (complex edge case handling)
 * 
 * FOLLOW-UP QUESTIONS:
 * - Implement LFU (Least Frequently Used) cache? (LeetCode #460)
 * - How to make it thread-safe? (Add locks/mutexes)
 * - What if we need to persist to disk? (Add serialization)
 * - How to handle cache invalidation? (Add TTL/expiration)
 * - What about distributed caching? (Redis, Memcached)
 * 
 * RELATED PROBLEMS:
 * - LFU Cache (LeetCode #460)
 * - Design HashMap (LeetCode #706)
 * - Design HashSet (LeetCode #705)
 * - All O(1) Data Structure (LeetCode #432)
 * - Design In-Memory File System (LeetCode #588)
 * 
 * VISUALIZATION of data structure:
 * 
 * HashMap:        Doubly Linked List:
 * key -> node     head <-> node1 <-> node2 <-> tail
 *                 (MRU)                        (LRU)
 * 
 * After get(key):
 * - Find node via HashMap: O(1)
 * - Remove from current position: O(1)
 * - Add to head: O(1)
 * 
 * After put(key, value) when full:
 * - Remove tail node: O(1)
 * - Remove from HashMap: O(1)
 * - Add new node to head: O(1)
 * - Add to HashMap: O(1)
 */

// Made with Bob
