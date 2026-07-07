/**
 * Starter code stubs for all 100 problems.
 * Each entry: { cpp, python, java }
 * The right-panel editor is pre-filled with these — empty function body only.
 */

export const starterCode = {
  '001-two-sum': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  },

  '002-three-sum': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        
    }
}`,
  },

  '003-container-with-most-water': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        `,
    java: `class Solution {
    public int maxArea(int[] height) {
        
    }
}`,
  },

  '004-trapping-rain-water': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        `,
    java: `class Solution {
    public int trap(int[] height) {
        
    }
}`,
  },

  '005-product-of-array-except-self': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        `,
    java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        
    }
}`,
  },

  '006-maximum-subarray': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`,
  },

  '007-merge-intervals': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        `,
    java: `class Solution {
    public int[][] merge(int[][] intervals) {
        
    }
}`,
  },

  '008-insert-interval': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        `,
    java: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        
    }
}`,
  },

  '009-longest-substring-without-repeating': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
    java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        
    }
}`,
  },

  '010-minimum-window-substring': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    string minWindow(string s, string t) {
        
    }
};`,
    python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,
    java: `class Solution {
    public String minWindow(String s, String t) {
        
    }
}`,
  },

  '011-sliding-window-maximum': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        
    }
}`,
  },

  '012-valid-parentheses': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
    java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
  },

  '013-group-anagrams': {
    cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        
    }
}`,
  },

  '014-longest-palindromic-substring': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        
    }
};`,
    python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        `,
    java: `class Solution {
    public String longestPalindrome(String s) {
        
    }
}`,
  },

  '015-string-to-integer-atoi': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int myAtoi(string s) {
        
    }
};`,
    python: `class Solution:
    def myAtoi(self, s: str) -> int:
        `,
    java: `class Solution {
    public int myAtoi(String s) {
        
    }
}`,
  },

  '016-rotate-image': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        `,
    java: `class Solution {
    public void rotate(int[][] matrix) {
        
    }
}`,
  },

  '017-spiral-matrix': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        `,
    java: `import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        
    }
}`,
  },

  '018-set-matrix-zeroes': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        `,
    java: `class Solution {
    public void setZeroes(int[][] matrix) {
        
    }
}`,
  },

  '019-find-first-and-last-position': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        
    }
}`,
  },

  '020-next-permutation': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        `,
    java: `class Solution {
    public void nextPermutation(int[] nums) {
        
    }
}`,
  },

  '021-reverse-linked-list': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}`,
  },

  '022-merge-two-sorted-lists': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}`,
  },

  '023-add-two-numbers': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        
    }
}`,
  },

  '024-remove-nth-node-from-end': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        
    }
}`,
  },

  '025-linked-list-cycle': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    bool hasCycle(ListNode* head) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public boolean hasCycle(ListNode head) {
        
    }
}`,
  },

  '026-linked-list-cycle-ii': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode detectCycle(ListNode head) {
        
    }
}`,
  },

  '027-reorder-list': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    void reorderList(ListNode* head) {
        
    }
};`,
    python: `from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        `,
    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public void reorderList(ListNode head) {
        
    }
}`,
  },

  '028-merge-k-sorted-lists': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        
    }
};`,
    python: `from typing import Optional, List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        `,
    java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        
    }
}`,
  },

  '029-copy-list-with-random-pointer': {
    cpp: `// Definition for a Node.
struct Node {
    int val;
    Node* next;
    Node* random;
    Node(int x) : val(x), next(nullptr), random(nullptr) {}
};

class Solution {
public:
    Node* copyRandomList(Node* head) {
        
    }
};`,
    python: `from typing import Optional

class Node:
    def __init__(self, x: int, next=None, random=None):
        self.val = x
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: Optional[Node]) -> Optional[Node]:
        `,
    java: `class Node {
    int val;
    Node next, random;
    Node(int x) { val = x; }
}

class Solution {
    public Node copyRandomList(Node head) {
        
    }
}`,
  },

  '030-lru-cache': {
    cpp: `#include <unordered_map>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        
    }

    int get(int key) {
        
    }

    void put(int key, int value) {
        
    }
};`,
    python: `class LRUCache:
    def __init__(self, capacity: int):
        

    def get(self, key: int) -> int:
        

    def put(self, key: int, value: int) -> None:
        `,
    java: `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
        
    }

    public int get(int key) {
        
    }

    public void put(int key, int value) {
        
    }
}`,
  },

  '031-binary-tree-inorder-traversal': {
    cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        `,
    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        
    }
}`,
  },

  '032-binary-tree-level-order-traversal': {
    cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        
    }
}`,
  },

  '033-maximum-depth-of-binary-tree': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxDepth(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        
    }
}`,
  },

  '034-validate-binary-search-tree': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    bool isValidBST(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public boolean isValidBST(TreeNode root) {
        
    }
}`,
  },

  '035-lowest-common-ancestor': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def lowestCommonAncestor(self, root: Optional[TreeNode], p: Optional[TreeNode], q: Optional[TreeNode]) -> Optional[TreeNode]:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        
    }
}`,
  },

  '036-binary-tree-maximum-path-sum': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxPathSum(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int maxPathSum(TreeNode root) {
        
    }
}`,
  },

  '037-serialize-deserialize-binary-tree': {
    cpp: `#include <string>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    string serialize(TreeNode* root) {
        
    }

    TreeNode* deserialize(string data) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        

    def deserialize(self, data: str) -> Optional[TreeNode]:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Codec {
    public String serialize(TreeNode root) {
        
    }

    public TreeNode deserialize(String data) {
        
    }
}`,
  },

  '038-construct-binary-tree-preorder-inorder': {
    cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        
    }
};`,
    python: `from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        
    }
}`,
  },

  '039-kth-smallest-element-in-bst': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        
    }
}`,
  },

  '040-invert-binary-tree': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public TreeNode invertTree(TreeNode root) {
        
    }
}`,
  },

  '041-number-of-islands': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        `,
    java: `class Solution {
    public int numIslands(char[][] grid) {
        
    }
}`,
  },

  '042-clone-graph': {
    cpp: `#include <unordered_map>
#include <vector>
using namespace std;

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node(int x) : val(x) {}
};

class Solution {
public:
    Node* cloneGraph(Node* node) {
        
    }
};`,
    python: `from typing import Optional

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []

class Solution:
    def cloneGraph(self, node: Optional[Node]) -> Optional[Node]:
        `,
    java: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node(int val) { this.val = val; this.neighbors = new ArrayList<>(); }
}

class Solution {
    public Node cloneGraph(Node node) {
        
    }
}`,
  },

  '043-course-schedule': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        `,
    java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        
    }
}`,
  },

  '044-course-schedule-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        `,
    java: `class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        
    }
}`,
  },

  '045-word-ladder': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        `,
    java: `import java.util.*;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        
    }
}`,
  },

  '046-graph-valid-tree': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        `,
    java: `class Solution {
    public boolean validTree(int n, int[][] edges) {
        
    }
}`,
  },

  '047-connected-components': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        `,
    java: `class Solution {
    public int countComponents(int n, int[][] edges) {
        
    }
}`,
  },

  '048-pacific-atlantic-water-flow': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        
    }
}`,
  },

  '049-alien-dictionary': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    string alienOrder(vector<string>& words) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        `,
    java: `class Solution {
    public String alienOrder(String[] words) {
        
    }
}`,
  },

  '050-diameter-of-binary-tree': {
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        
    }
};`,
    python: `from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        `,
    java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int diameterOfBinaryTree(TreeNode root) {
        
    }
}`,
  },

  '051-climbing-stairs': {
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        
    }
};`,
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        `,
    java: `class Solution {
    public int climbStairs(int n) {
        
    }
}`,
  },

  '052-house-robber': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int rob(int[] nums) {
        
    }
}`,
  },

  '053-house-robber-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int rob(int[] nums) {
        
    }
}`,
  },

  '054-coin-change': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        `,
    java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        
    }
}`,
  },

  '055-longest-increasing-subsequence': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        
    }
}`,
  },

  '056-longest-common-subsequence': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        
    }
};`,
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        `,
    java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        
    }
}`,
  },

  '057-word-break': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        `,
    java: `import java.util.*;

class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        
    }
}`,
  },

  '058-combination-sum-iv': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int combinationSum4(vector<int>& nums, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        `,
    java: `class Solution {
    public int combinationSum4(int[] nums, int target) {
        
    }
}`,
  },

  '059-decode-ways': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int numDecodings(string s) {
        
    }
};`,
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        `,
    java: `class Solution {
    public int numDecodings(String s) {
        
    }
}`,
  },

  '060-unique-paths': {
    cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        
    }
};`,
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        `,
    java: `class Solution {
    public int uniquePaths(int m, int n) {
        
    }
}`,
  },

  '061-jump-game': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canJump(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        `,
    java: `class Solution {
    public boolean canJump(int[] nums) {
        
    }
}`,
  },

  '062-edit-distance': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        
    }
};`,
    python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        `,
    java: `class Solution {
    public int minDistance(String word1, String word2) {
        
    }
}`,
  },

  '063-maximum-product-subarray': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int maxProduct(int[] nums) {
        
    }
}`,
  },

  '064-partition-equal-subset-sum': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canPartition(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        `,
    java: `class Solution {
    public boolean canPartition(int[] nums) {
        
    }
}`,
  },

  '065-regular-expression-matching': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isMatch(string s, string p) {
        
    }
};`,
    python: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        `,
    java: `class Solution {
    public boolean isMatch(String s, String p) {
        
    }
}`,
  },

  '066-subsets': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        
    }
}`,
  },

  '067-subsets-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        
    }
}`,
  },

  '068-permutations': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        
    }
}`,
  },

  '069-permutations-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        
    }
}`,
  },

  '070-combination-sum': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        
    }
}`,
  },

  '071-combination-sum-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        
    }
}`,
  },

  '072-palindrome-partitioning': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<string>> partition(string s) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<String>> partition(String s) {
        
    }
}`,
  },

  '073-letter-combinations-phone-number': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    vector<string> letterCombinations(string digits) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        `,
    java: `import java.util.*;

class Solution {
    public List<String> letterCombinations(String digits) {
        
    }
}`,
  },

  '074-generate-parentheses': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    vector<string> generateParenthesis(int n) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        `,
    java: `import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        
    }
}`,
  },

  '075-n-queens': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        
    }
}`,
  },

  '076-valid-parentheses': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
    java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
  },

  '077-min-stack': {
    cpp: `class MinStack {
public:
    MinStack() {
        
    }

    void push(int val) {
        
    }

    void pop() {
        
    }

    int top() {
        
    }

    int getMin() {
        
    }
};`,
    python: `class MinStack:
    def __init__(self):
        

    def push(self, val: int) -> None:
        

    def pop(self) -> None:
        

    def top(self) -> int:
        

    def getMin(self) -> int:
        `,
    java: `class MinStack {
    public MinStack() {
        
    }

    public void push(int val) {
        
    }

    public void pop() {
        
    }

    public int top() {
        
    }

    public int getMin() {
        
    }
}`,
  },

  '078-evaluate-reverse-polish-notation': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        `,
    java: `class Solution {
    public int evalRPN(String[] tokens) {
        
    }
}`,
  },

  '079-daily-temperatures': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        `,
    java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        
    }
}`,
  },

  '080-largest-rectangle-histogram': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        `,
    java: `class Solution {
    public int largestRectangleArea(int[] heights) {
        
    }
}`,
  },

  '081-implement-queue-using-stacks': {
    cpp: `#include <stack>
using namespace std;

class MyQueue {
public:
    MyQueue() {
        
    }

    void push(int x) {
        
    }

    int pop() {
        
    }

    int peek() {
        
    }

    bool empty() {
        
    }
};`,
    python: `class MyQueue:
    def __init__(self):
        

    def push(self, x: int) -> None:
        

    def pop(self) -> int:
        

    def peek(self) -> int:
        

    def empty(self) -> bool:
        `,
    java: `class MyQueue {
    public MyQueue() {
        
    }

    public void push(int x) {
        
    }

    public int pop() {
        
    }

    public int peek() {
        
    }

    public boolean empty() {
        
    }
}`,
  },

  '082-implement-stack-using-queues': {
    cpp: `#include <queue>
using namespace std;

class MyStack {
public:
    MyStack() {
        
    }

    void push(int x) {
        
    }

    int pop() {
        
    }

    int top() {
        
    }

    bool empty() {
        
    }
};`,
    python: `class MyStack:
    def __init__(self):
        

    def push(self, x: int) -> None:
        

    def pop(self) -> int:
        

    def top(self) -> int:
        

    def empty(self) -> bool:
        `,
    java: `class MyStack {
    public MyStack() {
        
    }

    public void push(int x) {
        
    }

    public int pop() {
        
    }

    public int top() {
        
    }

    public boolean empty() {
        
    }
}`,
  },

  '083-design-circular-queue': {
    cpp: `class MyCircularQueue {
public:
    MyCircularQueue(int k) {
        
    }

    bool enQueue(int value) {
        
    }

    bool deQueue() {
        
    }

    int Front() {
        
    }

    int Rear() {
        
    }

    bool isEmpty() {
        
    }

    bool isFull() {
        
    }
};`,
    python: `class MyCircularQueue:
    def __init__(self, k: int):
        

    def enQueue(self, value: int) -> bool:
        

    def deQueue(self) -> bool:
        

    def Front(self) -> int:
        

    def Rear(self) -> int:
        

    def isEmpty(self) -> bool:
        

    def isFull(self) -> bool:
        `,
    java: `class MyCircularQueue {
    public MyCircularQueue(int k) {
        
    }

    public boolean enQueue(int value) {
        
    }

    public boolean deQueue() {
        
    }

    public int Front() {
        
    }

    public int Rear() {
        
    }

    public boolean isEmpty() {
        
    }

    public boolean isFull() {
        
    }
}`,
  },

  '084-kth-largest-element': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        `,
    java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        
    }
}`,
  },

  '085-top-k-frequent-elements': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        
    }
}`,
  },

  '086-find-median-from-data-stream': {
    cpp: `#include <queue>
using namespace std;

class MedianFinder {
public:
    MedianFinder() {
        
    }

    void addNum(int num) {
        
    }

    double findMedian() {
        
    }
};`,
    python: `class MedianFinder:
    def __init__(self):
        

    def addNum(self, num: int) -> None:
        

    def findMedian(self) -> float:
        `,
    java: `class MedianFinder {
    public MedianFinder() {
        
    }

    public void addNum(int num) {
        
    }

    public double findMedian() {
        
    }
}`,
  },

  '087-merge-k-sorted-lists': {
    cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        
    }
};`,
    python: `from typing import Optional, List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        `,
    java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        
    }
}`,
  },

  '088-task-scheduler': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        `,
    java: `class Solution {
    public int leastInterval(char[] tasks, int n) {
        
    }
}`,
  },

  '089-reorganize-string': {
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    string reorganizeString(string s) {
        
    }
};`,
    python: `class Solution:
    def reorganizeString(self, s: str) -> str:
        `,
    java: `class Solution {
    public String reorganizeString(String s) {
        
    }
}`,
  },

  '090-k-closest-points-to-origin': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        `,
    java: `class Solution {
    public int[][] kClosest(int[][] points, int k) {
        
    }
}`,
  },

  '091-binary-search': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
    java: `class Solution {
    public int search(int[] nums, int target) {
        
    }
}`,
  },

  '092-search-in-rotated-sorted-array': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
    java: `class Solution {
    public int search(int[] nums, int target) {
        
    }
}`,
  },

  '093-find-minimum-rotated-sorted-array': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        `,
    java: `class Solution {
    public int findMin(int[] nums) {
        
    }
}`,
  },

  '094-search-2d-matrix': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        `,
    java: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        
    }
}`,
  },

  '095-median-of-two-sorted-arrays': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        `,
    java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        
    }
}`,
  },

  '096-kth-largest-element': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        `,
    java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        
    }
}`,
  },

  '097-meeting-rooms': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        `,
    java: `class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        
    }
}`,
  },

  '098-meeting-rooms-ii': {
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        `,
    java: `class Solution {
    public int minMeetingRooms(int[][] intervals) {
        
    }
}`,
  },

  '099-time-based-key-value-store': {
    cpp: `#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class TimeMap {
public:
    TimeMap() {
        
    }

    void set(string key, string value, int timestamp) {
        
    }

    string get(string key, int timestamp) {
        
    }
};`,
    python: `class TimeMap:
    def __init__(self):
        

    def set(self, key: str, value: str, timestamp: int) -> None:
        

    def get(self, key: str, timestamp: int) -> str:
        `,
    java: `import java.util.*;

class TimeMap {
    public TimeMap() {
        
    }

    public void set(String key, String value, int timestamp) {
        
    }

    public String get(String key, int timestamp) {
        
    }
}`,
  },

  '100-search-suggestions-system': {
    cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        
    }
};`,
    python: `from typing import List

class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        `,
    java: `import java.util.*;

class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        
    }
}`,
  },
}
