<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo url('css/style.css'); ?>">
    <script>
        var apiEndpoint = "<?php echo url() . '/api' ?>";
    </script>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-lg-offset-4 col-md-offset-4 col-lg-4 col-md-4">
                <h3 class="page-header">Tic Tac Toe</h3>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-offset-4 col-md-offset-4 col-lg-4 col-md-4">
                <div id="tic-tac-toe" class="col-lg-12 col-md-12"></div>
            </div
        </div>



    </div>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossorigin="anonymous"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="<?php echo url('js/tictactoe.js'); ?>"></script>

</body>
</html>