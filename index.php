<!DOCTYPE html>
<html>
<head>
    <title>Chris Bugert Treeview</title>
    <meta charset="utf-8">
    <script src="tree.js"></script>
    <link rel="stylesheet" type="text/css" href="main.css">
</head>
<body>
    <div id="header">
        <label for="branchName">Name: <input type="text" id="branchName"></label>
        <label for="lowerNum">Number Range: <input type="number" id="lowerNum"></label>
        <label for="upperNum"> - <input type="number" id="upperNum"></label>
        <label for="branchName">Number to generate: <input type="number" id="itemNum" max="15" min="1"></label>
        <input type="hidden" id="element" value="null" />
        <button id="branchSubmit" onclick="submitBranch()">Create</button>
        <button id="cancel" onclick="resetBranch()">Reset</button>
        <span id="errorMessage"></span>
    </div>
    <div id="content"></div>
</body>
</html>
